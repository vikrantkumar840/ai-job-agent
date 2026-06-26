from langgraph.graph import StateGraph, END

from workflows.state import JobState

from agents.ranking_agent import analyze_job
from agents.resume_agent import generate_resume
from agents.cover_letter_agent import generate_cover_letter
from agents.application_agent import save_application_artifacts
import time


def ranking_node(state: JobState):
    result = analyze_job(state["job"])
    time.sleep(2)
    return {"analysis": result}

def resume_node(state: JobState):
    resume = generate_resume(state["job"])
    time.sleep(2)
    return {"resume": resume}

def cover_node(state: JobState):
    letter = generate_cover_letter(state["job"])
    time.sleep(2)
    return {"cover_letter": letter}

def application_node(state: JobState):
    saved = save_application_artifacts(
        state["job"],
        state["analysis"],
        state["resume"],
        state["cover_letter"]
    )
    return {"saved": saved}


graph = StateGraph(JobState)

graph.add_node("ranking", ranking_node)
graph.add_node("resume", resume_node)
graph.add_node("cover", cover_node)
graph.add_node("application", application_node)

graph.set_entry_point("ranking")

graph.add_edge("ranking", "resume")
graph.add_edge("resume", "cover")
graph.add_edge("cover", "application")
graph.add_edge("application", END)

workflow = graph.compile()
