from tools.job_search import search_jobs
from workflows.graph import workflow

jobs = search_jobs()

print("\nTop Jobs\n")

for job in jobs:

    print("=" * 70)
    print(job["title"])
    print(job["company"])

    result = workflow.invoke({"job": job})

    analysis = result["analysis"]

    print("\nATS ANALYSIS")
    print("-" * 70)
    print("Score:", analysis["score"])
    print("Matched Skills:", ", ".join(analysis["matched_skills"]))
    print("Missing Skills:", ", ".join(analysis["missing_skills"]))
    print("Recommendation:", analysis["recommendation"])

    print("\nTAILORED RESUME")
    print("-" * 70)
    print(result["resume"])

    print("\nCOVER LETTER")
    print("-" * 70)
    print(result["cover_letter"])

    print("\n")
