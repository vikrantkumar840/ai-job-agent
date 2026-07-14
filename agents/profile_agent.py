import json
import re

from config.llm import invoke_llm


def extract_profile(resume_text: str):

    prompt = f"""
You are an expert Resume Parser.

Read the resume carefully.

Return ONLY valid JSON.

{{
"name":"",
"email":"",
"phone":"",
"location":"",
"summary":"",
"target_role":"",
"skills":[],
"experience":[],
"projects":[],
"education":[],
"certifications":[],
"career_role":""
}}

Rules:

target_role should be ONE best matching profession.

Examples

DevOps Engineer
Software Engineer
Data Analyst
Business Analyst
MBA Finance
HR Executive
Cloud Engineer
Python Developer
Java Developer
AI Engineer
QA Engineer
Cyber Security Engineer
Sales Executive
Marketing Executive

Resume

{resume_text}
"""

    response = invoke_llm(prompt)

    text = response.content.strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        text = match.group(0)

    try:
        return json.loads(text)

    except:
        return {
            "name":"",
            "email":"",
            "phone":"",
            "location":"",
            "summary":"",
            "career_role":"",
            "target_role":"",
            "skills":[],
            "experience":[],
            "projects":[],
            "education":[],
            "certifications":[],
            "years_of_experience":"",
            "primary_domain":"",
            "keywords":[]
            }
