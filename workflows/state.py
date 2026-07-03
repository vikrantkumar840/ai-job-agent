from typing import TypedDict, Dict, Any, List


class JobState(TypedDict):
    resume_text: str

    profile: Dict[str, Any]

    preferences: Dict[str, Any]

    chat_history: List[Dict[str, str]]

    jobs: List[Dict[str, Any]]

    ranked_jobs: List[Dict[str, Any]]

    selected_jobs: List[Dict[str, Any]]

    resume: str

    cover_letter: str
    
    session_id: str
