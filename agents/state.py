from typing import TypedDict, List

class AgentState(TypedDict):
    query: str
    jobs: List[dict]
    scored_jobs: List[dict]
