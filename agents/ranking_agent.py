from resumes.profile import SKILLS
from agents.job_matcher import score_job

def scoring_node(state):

    results = []

    for job in state["jobs"]:

        score = score_job(
            job["description"],
            SKILLS
        )

        job["score"] = score

        results.append(job)

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "scored_jobs": results
    }
