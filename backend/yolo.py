import torch
import cv2
import numpy as np
from shapely.geometry import box as shapely_box
from collections import deque

# Load YOLOv5 Model
try:
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    model.eval()
except Exception as e:
    print("Error loading YOLO model:", e)
    exit()

# # Object Detection Function
# def detect_objects(frame):
#     results = model(frame)
#     pred = results.xyxy[0].cpu().numpy()
#     boxes = pred[:, :4]
#     confidences = pred[:, 4]
#     class_ids = pred[:, 5].astype(int)

#     confidence_threshold = 0.5
#     mask = confidences > confidence_threshold
#     return boxes[mask], confidences[mask], class_ids[mask]

# # Draw Bounding Boxes and Alerts
# def draw_boxes(frame, boxes, confidences, class_ids, crashes):
#     for box, confidence, class_id in zip(boxes, confidences, class_ids):
#         x1, y1, x2, y2 = map(int, box)
#         if class_id in [2, 3, 5, 7]:  # Vehicle classes
#             color = (0, 255, 0)  # Green for vehicles
#         else:
#             color = (255, 255, 255)  # White for others
#         label = f"{model.names[class_id]}: {confidence:.2f}"
#         cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
#         cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

#     for crash in crashes:
#         for box in crash:
#             x1, y1, x2, y2 = map(int, box)
#             cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 3)  # Red for crashes

#     return frame

# # Vehicle Tracking Class
# class VehicleTracker:
#     def __init__(self, box, class_id, max_history=10):
#         self.positions = deque(maxlen=max_history)
#         self.class_id = class_id
#         self.update(box)
#         self.stopped = False
#         self.stop_duration = 0

#     def update(self, box):
#         center = ((box[0] + box[2]) / 2, (box[1] + box[3]) / 2)
#         self.positions.append(center)

#     def check_if_stopped(self, threshold=5, stop_frames=5):
#         if len(self.positions) < stop_frames:
#             return False
        
#         recent_positions = list(self.positions)[-stop_frames:]
#         max_movement = max(np.linalg.norm(np.array(p1) - np.array(p2)) 
#                            for p1, p2 in zip(recent_positions, recent_positions[1:]))
        
#         if max_movement < threshold:
#             self.stop_duration += 1
#             if self.stop_duration >= stop_frames:
#                 self.stopped = True
#         else:
#             self.stop_duration = 0
#             self.stopped = False

#         return self.stopped

# # Global tracker dictionary
# vehicle_trackers = {}

# # Detect Crashes
# def detect_crashes(boxes, class_ids, confidences):
#     vehicle_classes = [2, 3, 5, 7]  # COCO IDs: car, motorcycle, bus, truck
#     crashes = []

#     # Update trackers
#     current_trackers = {}
#     for box, class_id, conf in zip(boxes, class_ids, confidences):
#         if class_id in vehicle_classes and conf > 0.5:
#             tracker_id = get_tracker_id(box)
#             if tracker_id in vehicle_trackers:
#                 vehicle_trackers[tracker_id].update(box)
#             else:
#                 vehicle_trackers[tracker_id] = VehicleTracker(box, class_id)
#             current_trackers[tracker_id] = vehicle_trackers[tracker_id]

#     # Check for crashes
#     for id1, tracker1 in current_trackers.items():
#         for id2, tracker2 in current_trackers.items():
#             if id1 != id2:
#                 iou = calculate_iou(tracker1.positions[-1], tracker2.positions[-1])
#                 if iou > 0.3:
#                     if tracker1.check_if_stopped() and tracker2.check_if_stopped():
#                         crashes.append((tracker1.positions[-1], tracker2.positions[-1]))

#     # Clean up old trackers
#     vehicle_trackers.clear()
#     vehicle_trackers.update(current_trackers)

#     return crashes

# def get_tracker_id(box):
#     return f"{box[0]:.0f}_{box[1]:.0f}"

# def calculate_iou(box1, box2):
#     # Convert center points to bounding boxes for IoU calculation
#     def center_to_box(center):
#         return [center[0]-50, center[1]-50, center[0]+50, center[1]+50]
    
#     box1 = center_to_box(box1)
#     box2 = center_to_box(box2)
    
#     box1_shapely = shapely_box(box1[0], box1[1], box1[2], box1[3])
#     box2_shapely = shapely_box(box2[0], box2[1], box2[2], box2[3])

#     intersection_area = box1_shapely.intersection(box2_shapely).area
#     union_area = box1_shapely.union(box2_shapely).area
#     return intersection_area / union_area if union_area > 0 else 0

# # Video Processing
# video_path = "./videos/Big Crash.mp4"  # Replace with your video path
# cap = cv2.VideoCapture(video_path)

# if not cap.isOpened():
#     print("Error opening video file. Check the path:", video_path)
#     exit()

# crash_detected = False
# crash_frame_count = 0
# crash_duration = 30  # Frames for crash alert

# while cap.isOpened():
#     ret, frame = cap.read()
#     if not ret:
#         break  # End of video

#     boxes, confidences, class_ids = detect_objects(frame)
#     crashes = detect_crashes(boxes, class_ids, confidences)

#     if crashes:
#         crash_detected = True
#         crash_frame_count = crash_duration

#     if crash_detected:
#         cv2.putText(frame, "CRASH DETECTED!", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
#         crash_frame_count -= 1
#         if crash_frame_count == 0:
#             crash_detected = False

#     frame = draw_boxes(frame, boxes, confidences, class_ids, crashes)

#     cv2.imshow("Crash Detection", frame)
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break  # Quit on 'q' key

# cap.release()
# cv2.destroyAllWindows()
def draw_boxes(frame, boxes, confidences, class_ids, crashes):
    for box, confidence, class_id in zip(boxes, confidences, class_ids):
        x1, y1, x2, y2 = map(int, box)
        if class_id in [2, 3, 5, 7]:  # Vehicle classes
            color = (0, 255, 0)  # Green for vehicles
        else:
            color = (255, 255, 255)  # White for others
        label = f"{model.names[class_id]}: {confidence:.2f}"
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    for crash in crashes:
        for box in crash:
            x1, y1, x2, y2 = map(int, box)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 3)  # Red for crashes

    return frame

# Object Detection and Crash Detection Function
def detect_objects_and_crashes(frame):
    results = model(frame)
    pred = results.xyxy[0].cpu().numpy()
    boxes = pred[:, :4]
    confidences = pred[:, 4]
    class_ids = pred[:, 5].astype(int)

    confidence_threshold = 0.5
    mask = confidences > confidence_threshold
    boxes = boxes[mask]
    confidences = confidences[mask]
    class_ids = class_ids[mask]

    # Simple crash detection based on overlapping boxes
    crashes = []
    vehicle_classes = [2, 3, 5, 7]  # COCO IDs: car, motorcycle, bus, truck
    for i in range(len(boxes)):
        if class_ids[i] in vehicle_classes:
            for j in range(i+1, len(boxes)):
                if class_ids[j] in vehicle_classes:
                    iou = calculate_iou(boxes[i], boxes[j])
                    if iou > 0.3:  # Threshold for considering a crash
                        crashes.append((boxes[i], boxes[j]))

    return boxes, confidences, class_ids, crashes

def calculate_iou(box1, box2):
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - intersection

    return intersection / union if union > 0 else 0
# Video Processing
video_path = "./videos/Big Crash.mp4"  # Replace with your video path
cap = cv2.VideoCapture(video_path)

# Define variables before the loop
crash_detected = False
crash_frame_count = 0
crash_duration = 30  # Number of frames to display the crash alert

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break  # End of video

    boxes, confidences, class_ids, crashes = detect_objects_and_crashes(frame)

    if crashes:
        crash_detected = True
        crash_frame_count = crash_duration

    if crash_detected:
        cv2.putText(frame, "CRASH DETECTED!", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        crash_frame_count -= 1
        if crash_frame_count == 0:
            crash_detected = False

    frame = draw_boxes(frame, boxes, confidences, class_ids, crashes)

    cv2.imshow("Crash Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break  # Quit on 'q' key

cap.release()
cv2.destroyAllWindows()
