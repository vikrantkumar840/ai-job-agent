from typing import TypedDict


class JobState(TypedDict):
    job: dict
    analysis: dict
    resume: str
    cover_letter: str
