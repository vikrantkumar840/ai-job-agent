import json
from database.db import get_connection


def init_search_sessions_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS search_sessions (
            session_id TEXT PRIMARY KEY,
            user_id INTEGER,
            role TEXT,
            city TEXT,
            experience TEXT,
            websites TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def save_search_session(session_id, user_id, role, city, experience, websites):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO search_sessions (session_id, user_id, role, city, experience, websites)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(session_id) DO UPDATE SET
            role=excluded.role,
            city=excluded.city,
            experience=excluded.experience,
            websites=excluded.websites
    """, (session_id, user_id, role, city, experience, json.dumps(websites or [])))
    conn.commit()
    conn.close()


def get_search_session(session_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM search_sessions WHERE session_id = ?", (session_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    columns = ["session_id", "user_id", "role", "city", "experience", "websites", "created_at"]
    data = dict(zip(columns, row))
    data["websites"] = json.loads(data["websites"] or "[]")
    return data
