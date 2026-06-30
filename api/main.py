from fastapi import FastAPI

from api.routes.agent import router as agent_router
from api.routes.orchestrator import router as orchestrator_router
from vector.init_db import init_vector_db

app = FastAPI()

@app.on_event("startup")
def startup_event():
    init_vector_db()

app.include_router(agent_router)
app.include_router(orchestrator_router)
