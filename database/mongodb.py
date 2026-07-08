from pymongo import MongoClient

from database.config import settings


client = MongoClient(settings.MONGODB_URI)

db = client[settings.MONGODB_DATABASE]


profiles = db["user_profiles"]

resume_history = db["resume_history"]

job_sessions = db["job_sessions"]

cover_letters = db["cover_letters"]

chat_history = db["chat_history"]

ai_outputs = db["ai_outputs"]

chat_history = db.chat_history

interview_sessions = db["interview_sessions"]

resume_versions = db["resume_versions"]
