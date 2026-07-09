from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import fitz  # PyMuPDF

from api.models.resume import ResumeResponse
from auth.dependencies import get_current_user
from database.models import User

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


@router.post("/upload", response_model=ResumeResponse)
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

    # Future:
    # Save resume metadata using current_user.id
    # Store file in S3/local storage
    # Save parsed text in PostgreSQL/MongoDB
    # Generate embeddings in Qdrant

    return ResumeResponse(
        filename=file.filename,
        resume_text=text,
    )
