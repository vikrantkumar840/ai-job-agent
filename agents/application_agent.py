import os
from database.db import save_application
import re
OUTPUT_DIR = "outputs/applications"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def save_application_artifacts(job, analysis, resume, cover_letter):
    def clean(text):
        return re.sub(r'[^a-zA-Z0-9_]', '', text.replace(" ", "_"))
    safe_name = clean(job["title"]) + "_" + clean(job["company"])
    resume_path = f"{OUTPUT_DIR}/{safe_name}_resume.md"
    cover_path = f"{OUTPUT_DIR}/{safe_name}_cover.txt"

    with open(resume_path, "w") as f:
        f.write(resume)

    with open(cover_path, "w") as f:
        f.write(cover_letter)

    save_application(
        job,
        analysis.get("score", 0),
        resume_path,
        cover_path
    )

    return {
        "resume_path": resume_path,
        "cover_letter_path": cover_path
    }
