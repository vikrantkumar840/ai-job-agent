from fastapi import APIRouter, UploadFile, File, HTTPException
from api.models.resume import ResumeResponse
import fitz  # PyMuPDF

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    pdf_bytes = await file.read()

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    doc.close()

    return ResumeResponse(
        filename=file.filename,
        resume_text=text
    )
