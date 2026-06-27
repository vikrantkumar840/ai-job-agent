from tools.job_search import search_jobs
from typing import Optional, List
from pydantic import BaseModel

class JobSearchRequest(BaseModel):
    role: str
    city: str
    experience: Optional[str] = None
    sites: Optional[List[str]] = None
