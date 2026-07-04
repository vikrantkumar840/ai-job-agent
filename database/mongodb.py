from pymongo import MongoClient

from database.config import settings


client = MongoClient(settings.MONGODB_URI)

mongodb = client[settings.MONGODB_DATABASE]


profiles = mongodb["profiles"]

resumes = mongodb["resumes"]

generated_resumes = mongodb["generated_resumes"]

cover_letters = mongodb["cover_letters"]

chat_history = mongodb["chat_history"]

search_history = mongodb["search_history"]

workflow_runs = mongodb["workflow_runs"]
