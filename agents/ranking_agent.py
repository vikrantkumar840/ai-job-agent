# agents/ranking_agent.py

def analyze_job(payload: dict):

    profile = payload.get("profile", {})
    jobs = payload.get("jobs", [])

    skills = set([s.lower() for s in profile.get("skills", [])])

    ranked = []

    for job in jobs:
        text = (job.get("title", "") + " " + job.get("description", "")).lower()

        score = 0
        matched = []

        for skill in skills:
            if skill in text:
                score += 20
                matched.append(skill)

        ranked.append({
            "job": job,
            "score": score,
            "matched_skills": matched
        })

    ranked = sorted(ranked, key=lambda x: x["score"], reverse=True)

    return {
        "score": ranked[0]["score"] if ranked else 0,
        "ranked_jobs": [r["job"] for r in ranked]
    }
