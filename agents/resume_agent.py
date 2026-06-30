import os
from langchain_groq import ChatGroq

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is missing. Please set environment variable.")

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=api_key
)


def generate_resume(profile, selected_jobs, analysis=None, **kwargs):

    # -------------------------
    # SAFE JOB PICK
    # -------------------------
    job = selected_jobs[0] if selected_jobs else {}

    # -------------------------
    # PROMPT (STRICT + CLEAN)
    # -------------------------
    prompt = f"""
You are an expert ATS resume generator.

RULES:
- Do NOT invent experience
- Use ONLY given profile data
- Tailor resume for the target job
- Output MUST be valid JSON only
- No markdown, no explanation, no code blocks

PROFILE:
{profile}

TARGET JOB:
{job}

Return JSON in this format:
{{
  "summary": "...",
  "skills": [],
  "tailored_points": [],
  "recommendation": ""
}}
"""

    response = llm.invoke(prompt)

    return response.content
