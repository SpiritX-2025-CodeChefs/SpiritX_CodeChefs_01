from abc import ABC, abstractmethod


class _BaseDB(ABC):
    @abstractmethod
    async def connect(self):
        """Connect to the database"""
        pass

    @abstractmethod
    async def disconnect(self):
        """Disconnect from the database"""
        pass

    @abstractmethod
    async def insert_one(self, collection: str, document: dict):
        """Insert a document into a collection"""
        pass

    @abstractmethod
    async def find_one(self, collection: str, query: dict):
        """Find a document in a collection"""
        pass

    @abstractmethod
    async def update_one(self, collection: str, query: dict, update: dict):
        """Update a document in a collection"""
        pass

    @abstractmethod
    async def delete_one(self, collection: str, query: dict):
        """Delete a document from a collection"""
        pass
