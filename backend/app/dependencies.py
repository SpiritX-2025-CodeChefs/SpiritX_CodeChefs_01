from .core.services.mongo_db_service import MongoDBService

# Singleton database connection
_db_instance = None


async def get_db_service() -> MongoDBService:
    global _db_instance
    if _db_instance is None:
        _db_instance = MongoDBService()
        await _db_instance.connect()
    return _db_instance
