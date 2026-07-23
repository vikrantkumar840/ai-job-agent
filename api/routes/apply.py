from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.auto_apply_agent import run_auto_apply

router = APIRouter(prefix="/apply", tags=["apply"])

class ApplicantInfo(BaseModel):
    full_name: str
    email: str
    phone: str = ""

class AutoApplyRequest(BaseModel):
    ranked_jobs: list[dict]
    applicant: ApplicantInfo
    resume_file_path: str
    cover_letter_text: str
    max_jobs: int = 5
    notify_email: str | None = None

@router.post("/auto")
async def auto_apply(payload: AutoApplyRequest):
    try:
        result = run_auto_apply(
            ranked_jobs=payload.ranked_jobs,
            applicant=payload.applicant.dict(),
            resume_file_path=payload.resume_file_path,
            cover_letter_text=payload.cover_letter_text,
            max_jobs=payload.max_jobs,
            notify_email=payload.notify_email,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auto-apply run failed: {str(e)}")
    return result
