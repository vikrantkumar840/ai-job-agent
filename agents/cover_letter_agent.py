import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from tools.resume_parser import load_resume

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)

PROFILE = load_resume("resumes/base/Vikrant_devops-14-06-2026.pdf")


def generate_cover_letter(job):

    prompt = f"""
Write ATS cover letter.

Resume:
{PROFILE}

Job:
{job["description"]}

Rules:
- No fake names
- No fake achievements
- Keep professional
"""

    response = llm.invoke(prompt)
    return response.content
