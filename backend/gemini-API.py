from typing import List
import base64
from dotenv import load_dotenv
from PIL import Image
import io
import os
from google import genai
from google.genai import types
import json

load_dotenv()

class CrashEvent:
    def __init__(self, is_crash: bool, confidence: float, timestamp: str, description: str):
        self.is_crash = is_crash
        self.confidence = confidence
        self.timestamp = timestamp
        self.description = description

def crash_detection(image_paths: List[str]) -> CrashEvent:
    # Convert images to base64 strings
    base64_images = [image_to_base64(path) for path in image_paths]

    # Load API key from environment variables
    api_key = os.getenv("GEMINI_API_KEY")

    # Initialize the Gemini client
    client = genai.Client(api_key=api_key)

    # Prepare the prompt
    prompt = """
        Analyze this image and determine if it shows a car crash. Look for the following indicators:
        1. Collision Indicators:
        - Vehicles in direct contact with each other
        - Visible dents, scratches, or damage on cars
        - Deployed airbags inside vehicles

        2. Road Obstructions:
        - Debris on the road, such as car parts or glass
        - Vehicles off the road or on the sidewalk
        - Multiple vehicles stopped in unusual positions

        3. Emergency Signals:
        - Presence of emergency vehicles like ambulances or police cars
        - Vehicles with hazard lights on
        - Smoke or fire coming from a vehicle

        4. Driver or Passenger Behavior:
        - People exiting vehicles in unexpected locations
        - Occupants waving for help or showing distress

        5. Environmental Context:
        - Skid marks on the road
        - Damaged road infrastructure like barriers or signs

        Main thing to look for is if there are two cars in contact with each other and not focus on the other indicators.dev
        Return a JSON object in this exact format:

        {
            "events": [
                {
                    "timestamp": "mm:ss",
                    "description": "Brief description of what's happening in this frame",
                    "isDangerous": true/false // Set to true if the event involves a fall, injury, unease, pain, accident, or concerning behavior
                }
            ]
        }
    """

    # Prepare the image parts
    image_parts = [types.Part.from_bytes(data=base64.b64decode(image), mime_type="image/jpeg") for image in base64_images]

    # Generate content using the model
    response = client.models.generate_content(
        model="gemini-2.0-flash-exp",
        contents=[prompt, *image_parts]
    )

    # Process the response
    print(response)
    result = response.text
    print("API Response:", result)

    # Parse the JSON response (assuming the response is in JSON format)
    # try:
    #     parsed_result = json.loads(result)
    #     # Extract relevant information and create a CrashEvent object
    #     event = parsed_result["events"][0]
    #     crash_event = CrashEvent(
    #         is_crash=event["isDangerous"],
    #         confidence=1.0,  # Assuming confidence is not provided in the response
    #         timestamp=event["timestamp"],
    #         description=event["description"]
    #     )
    #     return crash_event
    # except json.JSONDecodeError:
    #     print("Error parsing JSON response")
    #     return None

def image_to_base64(image_path):
    # Open the image file
    with Image.open(image_path) as img:
        # Convert the image to RGB (if it's not already)
        img = img.convert("RGB")
        # Save the image to a bytes buffer
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        # Encode the bytes to base64
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return img_str

# Example usage
crash_detection(["./images/car-image.png"])
