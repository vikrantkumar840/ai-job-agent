from pydantic import BaseModel


class ProfileRequest(BaseModel):
    resume_text: str
