import json
import re
from functools import lru_cache
from config.llm import llm
from resumes.profile import PROFILE
from config.llm import invoke_llm

@lru_cache(maxsize=50)
def cached_llm(prompt):
    return llm.invoke(prompt)
def analyze_job(job):

    prompt = f"""
You are an ATS Resume Scoring AI.

Candidate Resume:
{PROFILE}

Job Description:
{job["description"]}

Compare the resume with the job.

Return ONLY a JSON object.

Do NOT explain.
Do NOT write markdown.
Do NOT wrap inside ```json.

Example:

{{
    "score":95,
    "matched_skills":["AWS","Terraform"],
    "missing_skills":["Python"],
    "recommendation":"Excellent match."
}}
"""

    response = invoke_llm(prompt)

    text = response.content.strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        text = match.group(0)

    try:
        return json.loads(text)

    except Exception as e:
        print(e)
        print(text)

        return {
            "score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "recommendation": "JSON Parsing Failed"
        }
