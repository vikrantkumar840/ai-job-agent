import os
import hmac
import hashlib
from datetime import datetime, timedelta, timezone

import razorpay
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth.dependencies import get_current_active_user
from database.models import Payment, User
from database.postgres import get_db

router = APIRouter(prefix="/billing", tags=["billing"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Adjust these to your real pricing. Amounts are in paise (INR * 100).
PLANS = {
    "pro_monthly": {"amount_paise": 49900, "label": "Pro - Monthly (₹499)"},
    "credits_pack_50": {"amount_paise": 19900, "label": "50 Credits Pack (₹199)"},
}


class CreateOrderRequest(BaseModel):
    plan: str  # one of PLANS keys


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.get("/plans")
def list_plans():
    return PLANS


@router.post("/create-order")
def create_order(
    payload: CreateOrderRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    plan = PLANS.get(payload.plan)
    if plan is None:
        raise HTTPException(status_code=400, detail="Unknown plan")

    order = client.order.create(
        {
            "amount": plan["amount_paise"],
            "currency": "INR",
            "notes": {"user_id": str(current_user.id), "plan": payload.plan},
        }
    )

    payment = Payment(
        user_id=current_user.id,
        razorpay_order_id=order["id"],
        amount_paise=plan["amount_paise"],
        plan=payload.plan,
        status="created",
    )
    db.add(payment)
    db.commit()

    return {
        "order_id": order["id"],
        "amount": plan["amount_paise"],
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,  # safe to expose - it's the public key
    }


@router.post("/verify")
def verify_payment(
    payload: VerifyPaymentRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Called by the frontend right after Razorpay Checkout succeeds.
    This is a fast-path for immediate UI feedback. The webhook below is the
    source of truth in case this call never happens (tab closed, network drop).
    """
    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": payload.razorpay_order_id,
                "razorpay_payment_id": payload.razorpay_payment_id,
                "razorpay_signature": payload.razorpay_signature,
            }
        )
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    payment = (
        db.query(Payment)
        .filter(Payment.razorpay_order_id == payload.razorpay_order_id)
        .first()
    )
    if payment is None or payment.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Order not found")

    _apply_paid_plan(payment, payload.razorpay_payment_id, db)

    return {"status": "success", "plan": current_user.plan}


@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Configure this URL in the Razorpay dashboard: Settings -> Webhooks ->
    https://api.YOUR_DOMAIN.com/billing/webhook, event: payment.captured
    This is the reliable path - trust this over /verify for granting access.
    """
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    expected = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event = await request.json()

    if event.get("event") == "payment.captured":
        entity = event["payload"]["payment"]["entity"]
        order_id = entity["order_id"]
        payment_id = entity["id"]

        payment = (
            db.query(Payment)
            .filter(Payment.razorpay_order_id == order_id)
            .first()
        )
        if payment is not None and payment.status != "paid":
            _apply_paid_plan(payment, payment_id, db)

    return {"status": "ok"}


def _apply_paid_plan(payment: Payment, razorpay_payment_id: str, db: Session):
    payment.status = "paid"
    payment.razorpay_payment_id = razorpay_payment_id

    user = db.query(User).filter(User.id == payment.user_id).first()

    if payment.plan == "pro_monthly":
        user.plan = "pro"
        user.plan_expires_at = datetime.now(timezone.utc) + timedelta(days=30)
    elif payment.plan == "credits_pack_50":
        user.credits = (user.credits or 0) + 50

    db.commit()
