from ._base_db import _BaseDB
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os


class MongoDBService(_BaseDB):
    def __init__(self):
        self.client = None
        self.db = None
        self.mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.db_name = os.getenv("DB_NAME", "auth_db")

    async def connect(self):
        self.client = AsyncIOMotorClient(self.mongo_uri)
        self.db = self.client[self.db_name]

    async def disconnect(self):
        if self.client:
            self.client.close()

    async def insert_one(self, collection: str, document: dict):
        result = await self.db[collection].insert_one(document)
        return str(result.inserted_id)

    async def find_one(self, collection: str, query: dict):
        return await self.db[collection].find_one(query)

    async def update_one(self, collection: str, query: dict, update: dict):
        result = await self.db[collection].update_one(query, {"$set": update})
        return result.modified_count > 0

    async def delete_one(self, collection: str, query: dict):
        result = await self.db[collection].delete_one(query)
        return result.deleted_count > 0

    # User-specific methods
    async def create_user(self, username: str, password: str):
        user_id = await self.insert_one(
            "userTable", {"username": username, "password": password}
        )
        return user_id

    async def find_user_by_username(self, username: str):
        return await self.find_one("userTable", {"username": username})

    # Session-specific methods
    async def create_session(self, user_id: str, session_token: str):
        expiry = datetime.utcnow() + timedelta(days=365)  # 1 year expiry
        await self.insert_one(
            "sessionTable", {"id": session_token, "userId": user_id, "expiry": expiry}
        )
        return expiry

    async def find_session(self, session_token: str):
        return await self.find_one("sessionTable", {"id": session_token})

    async def delete_session(self, session_token: str):
        return await self.delete_one("sessionTable", {"id": session_token})
