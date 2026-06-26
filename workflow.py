from tools.job_search import search_jobs
from agents.llm_node import analyze_job
from agents.resume_agent import tailor_resume


def run():

    jobs = search_jobs()

    results = []

    for job in jobs:

        analysis = analyze_job(job)

        resume = tailor_resume(job)

        results.append({
            "job": job,
            "analysis": analysis,
            "resume": resume
        })

    return results
