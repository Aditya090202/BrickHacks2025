from pymongo import MongoClient
import os
# Load environment variables (if using .env.local)
from dotenv import load_dotenv
load_dotenv(".env.local")


MONGO_URI = os.getenv("MONGODB_URL")

# Connect to MongoDB
client = MongoClient(MONGO_URI)

# Choose the database and collection
db = client['brickhack-2025']
crash_collection = db['car_crashes']

# Try to insert a test document manually
test_data = {
    "crash_id": "test_crash_001",
    "timestamp": "2025-02-22T14:30:00"
}

# Insert the document into the collection
insert_result = crash_collection.insert_one(test_data)

# Confirm if the data was inserted
print("Inserted document ID:", insert_result.inserted_id)

# Verify if the document is inserted
document = crash_collection.find_one({"crash_id": "test_crash_001"})
print("Inserted document:", document)
