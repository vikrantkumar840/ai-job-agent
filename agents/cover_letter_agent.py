import os
from langchain_groq import ChatGroq

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is missing. Please set environment variable.")

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=api_key
)


def generate_cover_letter(profile: dict, selected_jobs: list, resume: str = "", **kwargs):

    # -------------------------
    # SAFE JOB SELECTION
    # -------------------------
    job = selected_jobs[0] if selected_jobs else {}

    # -------------------------
    # PROMPT (CLEAN + CONTROLLED)
    # -------------------------
    prompt = f"""
You are an expert ATS cover letter writer.

RULES:
- Write a professional 1-page cover letter
- Do NOT hallucinate experience
- Use ONLY given profile + job info
- Keep tone formal and concise
- Output ONLY plain text (no markdown, no JSON, no code)

PROFILE:
{profile}

JOB:
{job}

RESUME (context):
{resume}

OUTPUT:
A clean ATS-optimized cover letter.
"""

    response = llm.invoke(prompt)

    return response.content
