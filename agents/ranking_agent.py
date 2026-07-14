from typing import Dict, List


def normalize(text: str) -> str:
    return (text or "").lower().strip()


def score_job(job: Dict, profile: Dict, preferences: Dict):

    score = 0

    reasons = []

    title = normalize(job.get("title"))
    company = normalize(job.get("company"))
    location = normalize(job.get("location"))
    description = normalize(job.get("description"))

    full_text = f"{title} {company} {location} {description}"

    # ----------------------------------------------------
    # Desired Role
    # ----------------------------------------------------

    role = normalize(preferences.get("role"))

    if role and role in title:
        score += 35
        reasons.append("Role Match")

    # ----------------------------------------------------
    # Industry
    # ----------------------------------------------------

    industry = normalize(preferences.get("industry"))

    if industry:

        words = [
            x.strip()
            for x in industry.split(",")
            if x.strip()
        ]

        for word in words:
            if word in full_text:
                score += 12
                reasons.append(word)

    # ----------------------------------------------------
    # Preferred Location
    # ----------------------------------------------------

    preferred_location = normalize(
        preferences.get("location")
    )

    if preferred_location:

        if preferred_location in location:
            score += 20
            reasons.append("Location")

    # ----------------------------------------------------
    # Experience
    # ----------------------------------------------------

    exp = normalize(
        preferences.get("experience")
    )

    if exp and exp in full_text:
        score += 10
        reasons.append("Experience")

    # ----------------------------------------------------
    # Resume Skills
    # ----------------------------------------------------

    skills = profile.get("skills", [])

    for skill in skills:

        skill = normalize(skill)

        if not skill:
            continue

        if skill in full_text:
            score += 6
            reasons.append(skill)

    # ----------------------------------------------------
    # Bonus
    # ----------------------------------------------------

    if "aws" in full_text:
        score += 3

    if "kubernetes" in full_text:
        score += 3

    if "docker" in full_text:
        score += 2

    if "terraform" in full_text:
        score += 2

    if "github actions" in full_text:
        score += 2

    if "jenkins" in full_text:
        score += 2

    return score, list(set(reasons))


def analyze_job(payload: Dict):

    jobs = payload.get("jobs", [])

    profile = payload.get("profile", {})

    preferences = payload.get("preferences", {})

    ranked = []

    print("=" * 80)
    print("Ranking Agent")
    print("=" * 80)

    for job in jobs:

        score, reasons = score_job(
            job,
            profile,
            preferences,
        )

        job["score"] = score
        job["matched"] = reasons

        ranked.append(job)

        print(
            f"{job.get('title')} -> {score}"
        )

    ranked.sort(
        key=lambda x: x["score"],
        reverse=True,
    )

    print("=" * 80)
    print(f"Ranked {len(ranked)} Jobs")
    print("=" * 80)

    return {

        "score":
            ranked[0]["score"]
            if ranked
            else 0,

        "ranked_jobs": ranked,

    }
