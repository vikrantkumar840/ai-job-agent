import json
import re

from config.llm import invoke_llm


def extract_profile(resume_text: str):

    prompt = f"""
You are an AI Resume Parser.

Extract the following information from the resume.

Return ONLY valid JSON.

Fields:

{{
"name":"",
"email":"",
"phone":"",
"location":"",
"summary":"",
"skills":[],
"experience":[],
"projects":[],
"education":[],
"certifications":[]
}}

Resume:

{resume_text}
"""

    response = invoke_llm(prompt)

    text = response.content.strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        text = match.group(0)

    try:
        return json.loads(text)

    except Exception:
        return {
            "name": "",
            "email": "",
            "phone": "",
            "location": "",
            "summary": "",
            "skills": [],
            "experience": [],
            "projects": [],
            "education": [],
            "certifications": []
        }
