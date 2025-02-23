import os
from typing import Union
import threading
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from websocket_handler import websocket_manager
from db.database import AtlasClient
from dotenv import load_dotenv
from datetime import datetime
from pydantic import BaseModel
from bson import ObjectId  # <-- Import ObjectId here
from contextlib import asynccontextmanager

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

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: clear the database
    await clear_database()
    print("Database cleared on server startup")
    yield
    # Shutdown: perform any cleanup if needed

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    timestamp: str
    location: str

# Example of actions you want to handle based on input
# async def handle_crash_detected(crash_id, timestamp, location):
#     """Force collection creation by inserting data into the collection"""
#     crash_data = {"crash_id": crash_id, "timestamp": timestamp, "crash_location":location}
    
#     # Check if the crash is already in the database
#     existing_crash = await client.find_one(COLLECTION_NAME, {"crash_id": crash_id})
#     if existing_crash:
#         # Ensure ObjectId is converted to string for the response
#         existing_crash = {key: objectid_to_str(value) if isinstance(value, ObjectId) else value for key, value in existing_crash.items()}
#         return {"message": "Crash already recorded.", "data": existing_crash}
    
#     insert_result = await client.insert_one(COLLECTION_NAME, crash_data)
#     print(f"Insert result: {insert_result.inserted_id}")
    
#     # Convert the inserted data's ObjectId to a string before returning it
#     inserted_data = {key: objectid_to_str(value) if isinstance(value, ObjectId) else value for key, value in crash_data.items()}
#     return {"message": "Crash added successfully.", "data": inserted_data}

async def handle_crash_detected(crash_id, timestamp, location):
    """Insert data into the collection for every crash detection"""
    crash_data = {"crash_id": crash_id, "timestamp": timestamp, "crash_location": location}
    
    # Insert the crash data without checking for existing entries
    insert_result = await client.insert_one(COLLECTION_NAME, crash_data)
    print(f"Insert result: {insert_result.inserted_id}")
    
    # Convert the inserted data's ObjectId to a string before returning it
    inserted_data = {key: objectid_to_str(value) if isinstance(value, ObjectId) else value for key, value in crash_data.items()}
    inserted_data['_id'] = str(insert_result.inserted_id)  # Add the new document's ID to the response
    
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
    print('INPUT', input)
    if input.action_type == "crash_detected":
        result = await handle_crash_detected(input.crash_id, input.timestamp, input.location)
        # Convert ObjectId to string before returning the response
        result_data = {key: objectid_to_str(value) if isinstance(value, ObjectId) else value for key, value in result.items()}
        return result_data
    
    elif input.action_type == "car_crash_alert":
        return await handle_car_crash_alert(input.crash_id)
    
    else:
        return await handle_other_action(input.dict())

@app.websocket("/ws/{camera_id}")
async def websocket_endpoint(websocket: WebSocket, camera_id: str):
    await websocket_manager.handle_connection(websocket, camera_id)


def serialize_document(doc):
    """Convert MongoDB document to JSON serializable format."""
    doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
    return doc

@app.get("/")
async def read_root():
    data = []
    
    # Use `async for` to iterate over the cursor
    async for doc in collection.find():
        data.append(serialize_document(doc))
    return data

async def clear_database():
    await client.database[COLLECTION_NAME].delete_many({})
    print("All documents deleted from the database.")

# @app.on_event("startup")
# async def startup_event():
#     await clear_database()
#     print("Database cleared on server startup")


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
    print("Server is running on port 8000")
