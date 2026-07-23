from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from browser.auto_apply import attempt_application
from tools.email_sender import send_application_summary

router = APIRouter(prefix="/apply", tags=["apply"])

class ApplicantInfo(BaseModel):
    full_name: str
    email: str
    phone: str = ""

class ApplyToJobRequest(BaseModel):
    job_url: str
    job_title: str = ""
    job_company: str = ""
    applicant: ApplicantInfo
    resume_file_path: str
    cover_letter_text: str
    notify_email: str | None = None

@router.post("/job")
async def apply_to_one_job(payload: ApplyToJobRequest):
    try:
        result = attempt_application(
            job_url=payload.job_url,
            applicant=payload.applicant.dict(),
            resume_file_path=payload.resume_file_path,
            cover_letter_text=payload.cover_letter_text,
        )
        result["title"] = payload.job_title
        result["company"] = payload.job_company
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Apply attempt failed: {str(e)}")

    send_application_summary([result], to_email=payload.notify_email)
    return result
