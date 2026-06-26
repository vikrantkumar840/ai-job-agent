from tools.job_search import search_jobs

def search_node(state):

    jobs = search_jobs()

    return {
        "jobs": jobs
    }
