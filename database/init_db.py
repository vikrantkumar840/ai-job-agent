import sqlite3
import os

DB_PATH = "database/app.db"

def init_db():
    os.makedirs("database", exist_ok=True)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_title TEXT,
        company TEXT,
        score INTEGER,
        resume_path TEXT,
        cover_letter_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("DB initialized successfully")
