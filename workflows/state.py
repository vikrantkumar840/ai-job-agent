from typing import TypedDict, Dict, Any


class JobState(TypedDict):
    job: Dict[str, Any]
    analysis: Dict[str, Any]
    resume: str
    cover_letter: str
    saved: Dict[str, Any]
