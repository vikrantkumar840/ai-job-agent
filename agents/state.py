from typing import TypedDict, List, Dict, Any


class AgentState(TypedDict):

    user_id: int

    resume_text: str

    profile: Dict[str, Any]

    preferences: Dict[str, Any]

    jobs: List[Dict]

    ranked_jobs: List[Dict]

    selected_jobs: List[Dict]

    resume: str

    cover_letter: str

    session_id: str
