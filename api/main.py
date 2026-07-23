from fastapi import FastAPI

from api.routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from api.routes.agent import router as agent_router
from api.routes.orchestrator import router as orchestrator_router
from vector.init_db import init_vector_db
from api.routes.search import router as search_router
from api.routes.resume import router as resume_router
from database.init_db import init_database
from api.routes.dashboard import router as dashboard_router
from api.routes.applications import router as application_router
from api.routes.apply import router as apply_router
from api.routes.chat import router as chat_router
from api.routes.chat_history import router as chat_history_router
from api.routes.ats import router as ats_router
from api.routes.resume_versions import router as resume_versions_router
from api.routes.interview import router as interview_router
from api.routes.analytics import router as analytics_router
from api.routes.regenerate import router as regenerate_router
from api.routes import auto_apply, jobs_regenerate
from api.routes import quick_apply


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://3.223.73.199:3000",
        "http://172.31.91.33:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
def startup_event():
    
     init_database()    
     init_vector_db()
app.include_router(search_router, prefix="/search")
app.include_router(agent_router)
app.include_router(orchestrator_router)
app.include_router(resume_router)
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(application_router)
app.include_router(apply_router)
app.include_router(chat_router)
app.include_router(chat_history_router)
app.include_router(ats_router)
app.include_router(analytics_router)
app.include_router(resume_versions_router)
app.include_router(interview_router)
app.include_router(regenerate_router)
app.include_router(auto_apply.router)
app.include_router(jobs_regenerate.router)
app.include_router(quick_apply.router)
