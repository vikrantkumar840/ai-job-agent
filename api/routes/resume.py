from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)

import fitz

from database.mongodb import resume_history
from database.mongodb import resume_versions

from api.models.resume import ResumeResponse

from auth.dependencies import get_current_user
from database.models import User


router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


# ============================================================
# Upload Resume
# ============================================================

@router.post(
    "/upload",
    response_model=ResumeResponse,
)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )


    pdf_bytes = await file.read()


    doc = fitz.open(
        stream=pdf_bytes,
        filetype="pdf",
    )


    text = ""

    for page in doc:
        text += page.get_text()


    doc.close()


    # Save raw resume for current user
    resume_history.insert_one(
        {
            "user_id": current_user.id,
            "filename": file.filename,
            "resume_text": text,
        }
    )


    return ResumeResponse(
        filename=file.filename,
        resume_text=text,
    )



# ============================================================
# Check User Resume Status
# ============================================================

@router.get("/status")
def resume_status(
    current_user: User = Depends(get_current_user),
):

    resume = (
        resume_history
        .find_one(
            {
                "user_id": current_user.id
            },
            sort=[
                ("_id", -1)
            ],
        )
    )


    if not resume:

        return {
            "has_resume": False,
        }


    return {
        "has_resume": True,
    }
