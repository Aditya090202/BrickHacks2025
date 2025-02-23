from fastapi import WebSocket
from typing import Dict, List
import asyncio
import numpy as np
import base64
import cv2
import json
# from google.cloud import aiplatform
# from vertexai.preview.generative_models import GenerativeModel, Part

class WebSocketManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, websocket: WebSocket, camera_id: str):
        await websocket.accept()
        self.active_connections[camera_id] = websocket
        print(f"Camera {camera_id} connected.")

    def disconnect(self, camera_id: str):
        if camera_id in self.active_connections:
            del self.active_connections[camera_id]
            print(f"Camera {camera_id} disconnected.")

    async def send_frames(self, websocket: WebSocket, camera_id: str):
        cap = cv2.VideoCapture(f"videos/{camera_id}.mp4")  # Use a webcam or video stream
        new = False
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    # print('end', camera_id)
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    new = True
                    # print('sending new')
                    continue
                
                _, buffer = cv2.imencode(".jpg", frame)
                frame_base64 = base64.b64encode(buffer).decode("utf-8")
                data = {
                    'frame':frame_base64,
                    'new':new
                }
                
                new = False
                await websocket.send_text(json.dumps(data))
                await asyncio.sleep(0.01)  # Send frames at 10 FPS
        except Exception as e:
            print(f"Error sending frames for {camera_id}: {e}")
        finally:
            cap.release()

    async def handle_connection(self, websocket: WebSocket, camera_id: str):
        await self.connect(websocket, camera_id)
        await self.send_frames(websocket, camera_id)
        self.disconnect(camera_id)

# Create a singleton instance
websocket_manager = WebSocketManager()