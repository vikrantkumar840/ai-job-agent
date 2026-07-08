from langchain_core.prompts import ChatPromptTemplate

from config.llm import llm


prompt = ChatPromptTemplate.from_template("""
You are an ATS Resume Expert.

Evaluate the following resume against the job description.

Resume:
{resume}

Job:
{job}

Return ONLY valid JSON.

{{
  "overall_score": 90,
  "keyword_match": 88,
  "experience": 85,
  "skills": 95,
  "formatting": 90,
  "missing_keywords": [
    "Helm",
    "Prometheus"
  ],
  "recommendations": [
    "Add measurable achievements",
    "Mention GitOps experience"
  ]
}}
""")


def score_resume(resume, job):
    chain = prompt | llm
    return chain.invoke(
        {
            "resume": resume,
            "job": job,
        }
    ).content
