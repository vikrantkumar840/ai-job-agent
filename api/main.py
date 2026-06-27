from fastapi import FastAPI

from api.routes import jobs
from api.routes import applications
from api.routes import settings

app = FastAPI(
    title="AI Job Agent API",
    version="1.0.0"
)

app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(settings.router)


@app.get("/")
def root():
    return {
        "status": "running",
        "service": "AI Job Agent API"
    }
