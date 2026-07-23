import json
from database.db import get_connection


def init_auto_apply_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS auto_applies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            job_url TEXT,
            job_title TEXT,
            job_company TEXT,
            full_name TEXT,
            email TEXT,
            resume_path TEXT,
            location TEXT,
            linkedin_url TEXT,
            status TEXT,
            ats_type TEXT,
            field_mapping TEXT,
            warnings TEXT,
            screenshot_path TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def create_preview_record(user_id, job_url, job_title, job_company, applicant, result) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO auto_applies (
            user_id, job_url, job_title, job_company,
            full_name, email, resume_path, location, linkedin_url,
            status, ats_type, field_mapping, warnings, screenshot_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id, job_url, job_title, job_company,
        applicant.get("full_name", ""), applicant.get("email", ""),
        applicant.get("resume_path", ""), applicant.get("location", ""),
        applicant.get("linkedin_url", ""),
        result.get("status"), result.get("ats_type"),
        json.dumps(result.get("field_mapping") or {}),
        result.get("warnings"), result.get("screenshot_path"),
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def get_auto_apply(auto_apply_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM auto_applies WHERE id = ?", (auto_apply_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    columns = [
        "id", "user_id", "job_url", "job_title", "job_company",
        "full_name", "email", "resume_path", "location", "linkedin_url",
        "status", "ats_type", "field_mapping", "warnings", "screenshot_path", "created_at",
    ]
    return dict(zip(columns, row))


def update_status(auto_apply_id: int, status: str, warnings: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE auto_applies SET status = ?, warnings = ? WHERE id = ?",
        (status, warnings, auto_apply_id),
    )
    conn.commit()
    conn.close()
