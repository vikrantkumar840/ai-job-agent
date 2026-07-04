from fastapi import FastAPI

from api.routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from api.routes.agent import router as agent_router
from api.routes.orchestrator import router as orchestrator_router
from vector.init_db import init_vector_db
from api.routes.search import router as search_router
from api.routes.resume import router as resume_router
from database.init_db import init_database



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
app.include_router(auth_router)
app.include_router(search_router, prefix="/search")
app.include_router(agent_router)
app.include_router(orchestrator_router)
app.include_router(resume_router)
