import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from tools.resume_parser import load_resume

PROFILE = load_resume(
    "resumes/base/Vikrant_devops-14-06-2026.pdf"
)
load_dotenv()
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_cover_letter(job):

    prompt = f"""
You are an expert HR resume assistant.

Candidate Resume:

{PROFILE}

Company:
{job["company"]}

Job Title:
{job["title"]}

Job Description:
{job["description"]}

Rules:
- Never invent recruiter names.
- Never invent company address.
- Never invent achievements.
- If hiring manager is unknown, write "Hiring Manager".
- Professional tone.
- Maximum 300 words.
- Output only the cover letter.
"""
    response = llm.invoke(prompt)

    return response.content
