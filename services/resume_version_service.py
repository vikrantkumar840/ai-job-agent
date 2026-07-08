from datetime import datetime

from database.mongodb import resume_versions


def save_resume_version(
    user_id,
    session_id,
    resume,
):
    print("=" * 80)
    print("Saving Resume Version")
    print("User:", user_id)
    print("Session:", session_id)

    latest = resume_versions.count_documents(
        {
            "user_id": user_id,
            "session_id": session_id,
        }
    )

    print("Current Version:", latest)

    resume_versions.insert_one(
        {
            "user_id": user_id,
            "session_id": session_id,
            "version": latest + 1,
            "resume": resume,
            "created_at": datetime.utcnow(),
        }
    )

    print("Resume Version Saved")
    print("=" * 80)
