import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from resumes.profile import PROFILE

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

def tailor_resume(job):

    prompt = f"""
You are an expert technical recruiter.

Candidate Resume:

{PROFILE}

Job Description:

{job["description"]}

Rewrite the resume so it is optimized
for this job.

Keep it ATS friendly.

Highlight relevant skills and projects.

Return only the updated resume.
"""

    response = llm.invoke(prompt)

    return response.content
