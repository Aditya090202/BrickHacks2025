from fastapi import WebSocket
from typing import Dict, List
import asyncio
import numpy as np
import base64
import cv2
# from google.cloud import aiplatform
# from vertexai.preview.generative_models import GenerativeModel, Part

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, camera_id: str):
        await websocket.accept()
        self.active_connections[camera_id] = websocket
        print(f"Camera {camera_id} connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, camera_id: str):
        if camera_id in self.active_connections:
            del self.active_connections[camera_id]
            print(f"Camera {camera_id} disconnected. Total connections: {len(self.active_connections)}")

    async def process_frame(self, camera_id: str, frame_data: str):
        try:
            # Decode base64 frame
            frame_bytes = base64.b64decode(frame_data)
            frame_array = np.frombuffer(frame_bytes, dtype=np.uint8)
            frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)
            
            # CNN Model to detect crashes
            def detect_crash(frame):
                # Load pre-trained YOLOv3 model for object detection
                net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
                layer_names = net.getLayerNames()
                output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

                # Prepare image for YOLO
                height, width, _ = frame.shape
                blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
                net.setInput(blob)
                outs = net.forward(output_layers)

                # Initialize lists for detected objects
                class_ids = []
                confidences = []
                boxes = []

                # Process detections
                for out in outs:
                    for detection in out:
                        scores = detection[5:]
                        class_id = np.argmax(scores)
                        confidence = scores[class_id]
                        
                        # Filter for car detections with high confidence
                        if confidence > 0.5 and class_id == 2:  # class_id 2 is for cars in COCO dataset
                            center_x = int(detection[0] * width)
                            center_y = int(detection[1] * height)
                            w = int(detection[2] * width)
                            h = int(detection[3] * height)

                            # Rectangle coordinates
                            x = int(center_x - w / 2)
                            y = int(center_y - h / 2)

                            boxes.append([x, y, w, h])
                            confidences.append(float(confidence))
                            class_ids.append(class_id)

                # Apply non-maximum suppression
                indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
                
                # Analyze car positions and movements for crash detection
                if len(indexes) > 1:  # At least 2 cars needed for crash detection
                    for i in range(len(indexes)):
                        for j in range(i + 1, len(indexes)):
                            box1 = boxes[indexes[i]]
                            box2 = boxes[indexes[j]]
                            
                            # Calculate IoU (Intersection over Union)
                            x1 = max(box1[0], box2[0])
                            y1 = max(box1[1], box2[1])
                            x2 = min(box1[0] + box1[2], box2[0] + box2[2])
                            y2 = min(box1[1] + box1[3], box2[1] + box2[3])
                            
                            if x2 > x1 and y2 > y1:  # Check for overlap
                                intersection = (x2 - x1) * (y2 - y1)
                                union = box1[2] * box1[3] + box2[2] * box2[3] - intersection
                                iou = intersection / union
                                
                                # If IoU is high, likely a crash
                                if iou > 0.5:
                                    return True
                
                return False

            # Call the crash detection function
            if detect_crash(frame):
                return "CRASH DETECTED!"

            # # Process with Gemini Vision
            # response = await self.gemini_pro_vision.generate_content(
            #     ["Detect and locate vehicles in this image. Return coordinates as JSON."],
            #     Part.from_image(frame)
            # )
            return 'NO CRASH DETECTED!'
            
            # return response.text
        except Exception as e:
            print(f"Error processing frame for camera {camera_id}: {e}")
            return None

    async def handle_connection(self, websocket: WebSocket, camera_id: str):
        try:
            await self.connect(websocket, camera_id)
            
            while True:
                frame_data = await websocket.receive_text()
                # print(frame_data)
                results = await self.process_frame(camera_id, frame_data)
                if results:
                    await websocket.send_text(results)
                
        except Exception as e:
            print(f"WebSocket error for camera {camera_id}: {e}")
        finally:
            self.disconnect(camera_id)

# Create a singleton instance
websocket_manager = WebSocketManager()