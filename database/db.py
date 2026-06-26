import sqlite3

conn = sqlite3.connect("database/jobs.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS jobs(

id INTEGER PRIMARY KEY,

title TEXT,

company TEXT,

score INTEGER,

status TEXT
)
""")

conn.commit()
def save_job(title, company, score):

    cursor.execute(
        """
        INSERT INTO jobs
        (title,company,score,status)

        VALUES(?,?,?,?)
        """,
        (title, company, score, "NEW")
    )

    conn.commit()
