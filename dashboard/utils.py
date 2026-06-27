import sqlite3
import pandas as pd
import requests
import os

DB = "database/app.db"
API = "http://127.0.0.1:8000"

def get_applications():
    if not os.path.exists(DB):
        return pd.DataFrame()

    conn = sqlite3.connect(DB)

    try:
        df = pd.read_sql("SELECT * FROM applications", conn)
    except:
        df = pd.DataFrame()

    conn.close()
    return df


def get_jobs():
    try:
        return requests.get(f"{API}/jobs").json()
    except:
        return []
