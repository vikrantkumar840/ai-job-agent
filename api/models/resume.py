from pydantic import BaseModel


class ResumeResponse(BaseModel):
    filename: str
    resume_text: str
