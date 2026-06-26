import os
import json

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

def analyze_job(job):

    prompt = f"""
You are a job matching AI.

Candidate Skills:
AWS
Terraform
Kubernetes
Docker
GitHub Actions
ArgoCD
Linux
EKS

Job:
{job["description"]}

Return ONLY valid JSON.

Example:

{{
    "score": 90,
    "matched_skills": ["AWS"],
    "missing_skills": ["Python"],
    "recommendation": "Good match"
}}
"""

    response = llm.invoke(prompt)

    try:
        return json.loads(response.content)

    except:
        return {
            "score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "recommendation": response.content
        }
