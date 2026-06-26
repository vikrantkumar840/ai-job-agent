import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq

from tools.resume_parser import load_resume

load_dotenv()

PROFILE = load_resume(
    "resumes/base/Vikrant_devops-14-06-2026.pdf"
)

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_resume(job):

    prompt = f"""
You are an expert ATS Resume Writer.

Candidate Resume:

{PROFILE}

Job Description:

{job["description"]}

Rules:
- Keep all true experience.
- Never invent projects.
- Never invent certifications.
- Never invent companies.
- Improve ATS keywords.
- Reorder skills according to the job.
- Keep markdown format.

Return ONLY the resume.
"""

    response = llm.invoke(prompt)

    return response.content
