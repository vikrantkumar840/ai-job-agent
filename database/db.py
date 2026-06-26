import sqlite3

DB_PATH = "database/app.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    with open("database/schema.sql", "r") as f:
        cursor.executescript(f.read())

    conn.commit()
    conn.close()


def save_application(job, score, resume_path, cover_letter_path):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO applications (
            job_title, company, location, score, resume_path, cover_letter_path
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        job["title"],
        job["company"],
        job.get("location", ""),
        score,
        resume_path,
        cover_letter_path
    ))

    conn.commit()
    conn.close()
