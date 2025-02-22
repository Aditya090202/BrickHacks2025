import motor.motor_asyncio
from bson import ObjectId
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# load_dotenv()
load_dotenv('.env.local')
MONGODB_URL = os.getenv("MONGODB_URL")

# # Replace this with your MongoDB Atlas connection string
# MONGODB_URL = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mydb?retryWrites=true&w=majority"

class AtlasClient ():

   def __init__ (self, dbname,altas_uri=MONGODB_URL):
    #    print(MONGODB_URL)
       self.mongodb_client = MongoClient(altas_uri)
       self.database = self.mongodb_client[dbname]

   ## A quick way to test if we can connect to Atlas instance
   def ping (self):
       self.mongodb_client.admin.command('ping')
       print("Connected to Atlas instance")

   def get_collection (self, collection_name):
       collection = self.database[collection_name]
       return collection

   def find (self, collection_name, filter = {}, limit=0):
       collection = self.database[collection_name]
       items = list(collection.find(filter=filter, limit=limit))
       return items
   
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