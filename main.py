from concurrent.futures import ThreadPoolExecutor
from tools.job_search import search_jobs
from workflows.graph import workflow

jobs = search_jobs()

print("\nTop Jobs\n")

def process(job):
    result = workflow.invoke({"job": job})

    print("=" * 70)
    print(job["title"])
    print(job["company"])
    print(result["analysis"])

    return result


with ThreadPoolExecutor(max_workers=3) as executor:
    executor.map(process, jobs)
