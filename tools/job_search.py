import traceback
import uuid
from browser.linkedin import search_linkedin_jobs
from tools.remoteok import search_remoteok_jobs
from tools.adzuna_search import search_adzuna_jobs
from vector.indexer import index_jobs
from vector.retriever import search_jobs as vector_search

CITY_ALIASES = {
    "bangalore": ["bangalore", "bengaluru"],
    "bengaluru": ["bangalore", "bengaluru"],
    "mumbai": ["mumbai", "bombay"],
    "bombay": ["mumbai", "bombay"],
    "gurgaon": ["gurgaon", "gurugram"],
    "gurugram": ["gurgaon", "gurugram"],
    "pune": ["pune", "poona"],
}

SOURCE_FUNCTIONS = {
    "linkedin": lambda role, city, experience, limit: search_linkedin_jobs(
        role=role, location=city or "India", experience=experience
    ),
    "remoteok": lambda role, city, experience, limit: search_remoteok_jobs(),
    "adzuna": lambda role, city, experience, limit: search_adzuna_jobs(
        role=role, city=city, limit=limit
    ),
}

DEFAULT_SOURCES = ["linkedin", "remoteok"]


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


def location_matches(job_location: str, city: str) -> bool:
    job_location = (job_location or "").lower()
    city = city.lower()

    if not job_location:
        return False
    if "remote" in job_location:
        return True

    variants = CITY_ALIASES.get(city, [city])
    return any(variant in job_location for variant in variants)


def search_jobs(
    role: str,
    city: str = "",
    website: str = "",
    websites: list[str] = None,
    experience: str = "",
    limit: int = 10,
):
    selected = list(websites) if websites else []
    if website and website not in selected:
        selected.append(website)
    if not selected:
        selected = DEFAULT_SOURCES

    selected = [s.strip().lower() for s in selected]

    jobs = []

    print("=" * 80)
    print("Searching Jobs")
    print("Role      :", role)
    print("Location  :", city)
    print("Sources   :", selected)
    print("Experience:", experience)
    print("=" * 80)

    for source_name in selected:
        source_fn = SOURCE_FUNCTIONS.get(source_name)
        if not source_fn:
            print(f"Unknown source '{source_name}' — skipping. Valid: {list(SOURCE_FUNCTIONS.keys())}")
            continue

        try:
            source_jobs = source_fn(role, city, experience, limit)
            jobs.extend(source_jobs)
            print(f"{source_name} returned {len(source_jobs)} jobs")
        except Exception:
            print(f"{source_name} search failed")
            traceback.print_exc()

    if city:
        filtered = [job for job in jobs if location_matches(job.get("location", ""), city)]
        print(f"Location filter ({city}): {len(filtered)} of {len(jobs)} jobs matched")
        if filtered:
            jobs = filtered
        else:
            print("No location matches — keeping all jobs unfiltered instead of dropping to 0/1")

    jobs = remove_duplicates(jobs)
    jobs = jobs[: max(limit * 3, 30)]

    print("=" * 80)
    print(f"Jobs Collected : {len(jobs)}")
    print("=" * 80)

    session_id = str(uuid.uuid4())

    if not jobs:
        print("No jobs found from any source — returning empty result.")
        return {"jobs": [], "session_id": session_id}

    index_jobs(jobs, session_id)

    semantic_query = f"""
Role:
{role}
Location:
{city}
Experience:
{experience}
Sources:
{', '.join(selected)}
""".strip()

    ranked_jobs = vector_search(
        query=semantic_query,
        session_id=session_id,
        limit=limit,
    )

    print("=" * 80)
    print(f"Returning Top {len(ranked_jobs)} Jobs")
    print("=" * 80)

    return {
        "jobs": ranked_jobs,
        "session_id": session_id,
    }
