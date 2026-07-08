from langchain_core.prompts import ChatPromptTemplate

from config.llm import llm


prompt = ChatPromptTemplate.from_template("""
You are an interview coach.

Job:

{job}

Generate:

- 10 interview questions
- Ideal answers
- Tips

Return in markdown.
""")

chain = prompt | llm


def generate_questions(job):
    return chain.invoke(
        {
            "job": job
        }
    ).content
