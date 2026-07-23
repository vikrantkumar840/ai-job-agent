from browser.auto_apply import attempt_application
from tools.email_sender import send_application_summary


def run_auto_apply(
    ranked_jobs: list[dict],
    applicant: dict,
    resume_file_path: str,
    cover_letter_text: str,
    max_jobs: int = 5,
    notify_email: str = None,
) -> dict:
    results = []
    jobs_to_try = [j for j in ranked_jobs if j.get("link")][:max_jobs]

    print("=" * 80)
    print(f"Auto-Apply: attempting {len(jobs_to_try)} jobs")
    print("=" * 80)

    for job in jobs_to_try:
        job_url = job["link"]
        print(f"-> {job.get('title', 'Unknown role')} at {job.get('company', 'Unknown company')}")
        print(f"   {job_url}")

        result = attempt_application(
            job_url=job_url,
            applicant=applicant,
            resume_file_path=resume_file_path,
            cover_letter_text=cover_letter_text,
        )
        result["title"] = job.get("title")
        result["company"] = job.get("company")
        results.append(result)

        print(f"   status: {result['status']} — {result.get('reason', '')}")

    print("=" * 80)
    email_sent = send_application_summary(results, to_email=notify_email)
    print(f"Summary email sent: {email_sent}")
    print("=" * 80)

    return {"results": results, "email_sent": email_sent}
