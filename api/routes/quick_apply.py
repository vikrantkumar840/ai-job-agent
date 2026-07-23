from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from browser.auto_apply import preview_fill, submit_application
from database.auto_apply_store import (
    init_auto_apply_table,
    create_preview_record,
    update_status,
)
from tools.email_sender import send_application_summary

init_auto_apply_table()

router = APIRouter(prefix="/auto-apply", tags=["auto-apply"])


class QuickApplyRequest(BaseModel):
    job_url: str
    job_title: Optional[str] = ""
    job_company: Optional[str] = ""
    full_name: str
    email: str
    resume_path: str = ""
    location: str = ""
    linkedin_url: str = ""
    user_id: Optional[int] = None
    notify_email: Optional[str] = None


@router.post("/quick")
async def quick_apply(payload: QuickApplyRequest):
    applicant = {
        "full_name": payload.full_name,
        "email": payload.email,
        "resume_path": payload.resume_path,
        "location": payload.location,
        "linkedin_url": payload.linkedin_url,
    }

    try:
        preview_result = preview_fill(payload.job_url, applicant)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Apply failed: {str(e)}")

    auto_apply_id = create_preview_record(
        user_id=payload.user_id,
        job_url=payload.job_url,
        job_title=payload.job_title,
        job_company=payload.job_company,
        applicant=applicant,
        result=preview_result,
    )

    final_status = preview_result["status"]
    final_warnings = preview_result.get("warnings")

    if preview_result["status"] == "previewed":
        try:
            submit_result = submit_application(payload.job_url, applicant)
        except Exception as e:
            submit_result = {"status": "failed", "warnings": str(e)}

        final_status = submit_result["status"]
        final_warnings = submit_result.get("warnings")
        update_status(auto_apply_id, final_status, final_warnings)
    else:
        update_status(auto_apply_id, final_status, final_warnings)

    send_application_summary([{
        "job_url": payload.job_url,
        "title": payload.job_title,
        "company": payload.job_company,
        "status": final_status,
        "reason": final_warnings,
    }], to_email=payload.notify_email)

    screenshot_url = f"/auto-apply/{auto_apply_id}/screenshot" if preview_result.get("screenshot_path") else None

    return {
        "auto_apply_id": auto_apply_id,
        "status": final_status,
        "warnings": final_warnings,
        "screenshot_url": screenshot_url,
    }
