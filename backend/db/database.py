import motor.motor_asyncio
from bson import ObjectId
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load dotenv
load_dotenv('.env.local')
MONGODB_URL = os.getenv("MONGODB_URL")

class AtlasClient():
    def __init__(self, dbname, altas_uri=MONGODB_URL):
        # Use motor for async operations
        self.mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(altas_uri)
        self.database = self.mongodb_client[dbname]

    async def ping(self):
        # Test connection (async)
        await self.mongodb_client.admin.command('ping')
        print("Connected to Atlas instance")

    def get_collection(self, collection_name):
        collection = self.database[collection_name]
        return collection

    async def find(self, collection_name, filter={}, limit=0):
        collection = self.database[collection_name]
        items = await collection.find(filter).to_list(limit)
        return items

    async def insert_one(self, collection_name, document):
        collection = self.database[collection_name]
        result = await collection.insert_one(document)
        return result

    async def find_one(self, collection_name, filter={}):
        collection = self.database[collection_name]
        return await collection.find_one(filter)


# Helper class to handle ObjectId conversion
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# Convert ObjectId to string for easier serialization
def objectid_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj
