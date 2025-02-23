import os
from typing import Union
from fastapi import FastAPI
from db.database import AtlasClient
from dotenv import load_dotenv
from datetime import datetime
from pydantic import BaseModel
from bson import ObjectId  # <-- Import ObjectId here

# Utility function to convert ObjectId to string
def objectid_to_str(obj):
    """Convert ObjectId to string."""
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

# Load environment variables from .env.local
load_dotenv(".env.local")

# Get MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGODB_URL")

app = FastAPI()

DB_NAME = 'brickhack-2025'

# The collections include: 
# - users
# - crash (nothing for now)
COLLECTION_NAME = 'car_crashes'

client = AtlasClient(dbname=DB_NAME, altas_uri=MONGO_URI)
collection = client.get_collection(COLLECTION_NAME)

# Define a class for incoming requests (You can modify this according to your input type)
class CrashInput(BaseModel):
    action_type: str  # This could be 'crash_detected', 'car_crash_alert', etc.
    crash_id: str
    timestamp: datetime

# Example of actions you want to handle based on input
async def handle_crash_detected(crash_id, timestamp):
    """Force collection creation by inserting data into the collection"""
    crash_data = {"crash_id": crash_id, "timestamp": timestamp}
    
    # Check if the crash is already in the database
    existing_crash = await client.find_one(COLLECTION_NAME, {"crash_id": crash_id})
    if existing_crash:
        # Ensure ObjectId is converted to string for the response
        existing_crash = {key: objectid_to_str(value) if isinstance(value, ObjectId) else value for key, value in existing_crash.items()}
        return {"message": "Crash already recorded.", "data": existing_crash}
    
    insert_result = await client.insert_one(COLLECTION_NAME, crash_data)
    print(f"Insert result: {insert_result.inserted_id}")
    
    # Convert the inserted data's ObjectId to a string before returning it
    inserted_data = {key: objectid_to_str(value) if isinstance(value, ObjectId) else value for key, value in crash_data.items()}
    return {"message": "Crash added successfully.", "data": inserted_data}

async def handle_car_crash_alert(crash_id):
    """Handle car crash alert (e.g., send an email or notification)"""
    # Simulate sending an alert, for example:
    print(f"Sending alert for crash_id: {crash_id}")
    return {"message": f"Alert sent for crash_id: {crash_id}"}

async def handle_other_action(input_data):
    """Handle other types of actions"""
    # You can define any other action here
    print(f"Handling other action: {input_data}")
    return {"message": "Other action handled successfully."}

@app.post("/process_input/")
async def process_input(input: CrashInput):
    """Process the input and execute specific actions based on action_type"""
    if input.action_type == "crash_detected":
        result = await handle_crash_detected(input.crash_id, input.timestamp)
        # Convert ObjectId to string before returning the response
        result_data = {key: objectid_to_str(value) if isinstance(value, ObjectId) else value for key, value in result.items()}
        return result_data
    
    elif input.action_type == "car_crash_alert":
        return await handle_car_crash_alert(input.crash_id)
    
    else:
        return await handle_other_action(input.dict())

@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
    print("Server is running on port 8000")
