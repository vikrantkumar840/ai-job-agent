def score_job(job, skills):

    score = 0

    text = job.lower()

    for skill in skills:
        if skill.lower() in text:
            score += 10

    return score
