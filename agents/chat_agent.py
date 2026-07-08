from langchain_core.prompts import ChatPromptTemplate

from config.llm import llm


prompt = ChatPromptTemplate.from_template(
    """
You are an expert AI Career Coach.

Resume:
{resume}

Cover Letter:
{cover_letter}

Jobs:
{jobs}

Conversation History:
{history}

User:
{question}

Assistant:
"""
)


def chat(
    resume,
    cover_letter,
    jobs,
    history,
    question,
):
    chain = prompt | llm

    return chain.invoke(
        {
            "resume": resume,
            "cover_letter": cover_letter,
            "jobs": jobs,
            "history": history,
            "question": question,
        }
    ).content
