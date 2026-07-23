import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

from browser.auto_apply import preview_fill, submit_application
from database.auto_apply_store import (
    init_auto_apply_table,
    create_preview_record,
    get_auto_apply,
    update_status,
)
from tools.email_sender import send_application_summary

init_auto_apply_table()

router = APIRouter(prefix="/auto-apply", tags=["auto-apply"])


class ApplicantPayload(BaseModel):
    job_url: str
    job_title: Optional[str] = ""
    job_company: Optional[str] = ""
    full_name: str
    email: str
    resume_path: str = ""
    location: str = ""
    linkedin_url: str = ""
    user_id: Optional[int] = None


class ConfirmPayload(BaseModel):
    full_name: str
    email: str
    resume_path: str = ""
    location: str = ""
    linkedin_url: str = ""
    notify_email: Optional[str] = None


@router.post("/preview")
async def preview(payload: ApplicantPayload):
    applicant = {
        "full_name": payload.full_name,
        "email": payload.email,
        "resume_path": payload.resume_path,
        "location": payload.location,
        "linkedin_url": payload.linkedin_url,
    }

    try:
        result = preview_fill(payload.job_url, applicant)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preview failed: {str(e)}")

    auto_apply_id = create_preview_record(
        user_id=payload.user_id,
        job_url=payload.job_url,
        job_title=payload.job_title,
        job_company=payload.job_company,
        applicant=applicant,
        result=result,
    )

    screenshot_url = f"/auto-apply/{auto_apply_id}/screenshot" if result.get("screenshot_path") else None

    return {
        "auto_apply_id": auto_apply_id,
        "status": result["status"],
        "ats_type": result["ats_type"],
        "field_mapping": json.dumps(result.get("field_mapping") or {}),
        "warnings": result.get("warnings"),
        "screenshot_url": screenshot_url,
    }


@router.post("/{auto_apply_id}/confirm")
async def confirm(auto_apply_id: int, payload: ConfirmPayload):
    record = get_auto_apply(auto_apply_id)
    if not record:
        raise HTTPException(status_code=404, detail="Auto-apply record not found.")

    if record["status"] not in ("previewed",):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot confirm from status '{record['status']}'. Only a previewed application can be submitted.",
        )

    applicant = {
        "full_name": payload.full_name,
        "email": payload.email,
        "resume_path": payload.resume_path,
        "location": payload.location,
        "linkedin_url": payload.linkedin_url,
    }

    try:
        result = submit_application(record["job_url"], applicant)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Submit failed: {str(e)}")

    update_status(auto_apply_id, result["status"], result.get("warnings"))

    send_application_summary([{
        "job_url": record["job_url"],
        "title": record["job_title"],
        "company": record["job_company"],
        "status": result["status"],
        "reason": result.get("warnings"),
    }], to_email=payload.notify_email)

    return {"status": result["status"], "warnings": result.get("warnings")}


@router.post("/{auto_apply_id}/reject")
async def reject(auto_apply_id: int):
    record = get_auto_apply(auto_apply_id)
    if not record:
        raise HTTPException(status_code=404, detail="Auto-apply record not found.")

    update_status(auto_apply_id, "rejected", None)
    return {"status": "rejected"}


@router.get("/{auto_apply_id}/screenshot")
async def screenshot(auto_apply_id: int):
    record = get_auto_apply(auto_apply_id)
    if not record or not record.get("screenshot_path"):
        raise HTTPException(status_code=404, detail="No screenshot available for this record.")

    return FileResponse(record["screenshot_path"], media_type="image/png")
