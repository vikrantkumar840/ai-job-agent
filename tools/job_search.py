import traceback

from browser.linkedin import search_linkedin_jobs

from vector.indexer import index_jobs
from vector.retriever import search_jobs as vector_search


def remove_duplicates(jobs):

    seen = set()
    unique = []

    for job in jobs:

        key = (
            job.get("title", "").strip().lower(),
            job.get("company", "").strip().lower(),
        )

        if key not in seen:
            seen.add(key)
            unique.append(job)

    return unique


def search_jobs(
    role: str,
    city: str = "",
    website: str = "LinkedIn",
    experience: str = "",
    limit: int = 10,
):

    jobs = []

    role = role or "Software Engineer"

    print("=" * 80)
    print("Searching Jobs")
    print("Role      :", role)
    print("Location  :", city)
    print("Website   :", website)
    print("Experience:", experience)
    print("=" * 80)

    try:

        linkedin_jobs = search_linkedin_jobs(
            role=role,
            location=city or "India",
            experience=experience,
        )

        jobs.extend(linkedin_jobs)

    except Exception:

        print("LinkedIn Search Failed")
        traceback.print_exc()

    # Filter by location if possible
    if city:

        filtered = []

        for job in jobs:

            job_location = job.get("location", "").lower()

            if city.lower() in job_location:
                filtered.append(job)

        # Use filtered jobs only if at least one match exists
        if filtered:
            jobs = filtered

    jobs = remove_duplicates(jobs)

    jobs = jobs[: max(limit * 3, 30)]

    print("=" * 80)
    print(f"Jobs Collected : {len(jobs)}")
    print("=" * 80)

    if jobs:
        index_jobs(jobs)

    semantic_query = f"""
Role:
{role}

Location:
{city}

Experience:
{experience}

Website:
{website}
""".strip()

    ranked_jobs = vector_search(
        query=semantic_query,
        limit=limit,
    )

    print("=" * 80)
    print(f"Returning Top {len(ranked_jobs)} Jobs")
    print("=" * 80)

    return ranked_jobs
