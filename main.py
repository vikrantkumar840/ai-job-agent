from tools.job_search import search_jobs
from workflows.graph import workflow
from database.db import init_db


init_db()

jobs = search_jobs()

jobs = search_jobs()[:3]   # LIMIT TO 3 JOBS ONLY
print("\nTop Jobs\n")

for job in jobs:

    print("=" * 70)
    print(job["title"])
    print(job["company"])

    result = workflow.invoke({"job": job})

    print("\nSAVED:", result["saved"])
