import cv2
import numpy as np

# # Load the Haar Cascade classifier for car detection
# haar_cascade = './cars.xml'
# car_cascade = cv2.CascadeClassifier(haar_cascade)

# # Check if the classifier is loaded correctly
# if car_cascade.empty():
#     raise IOError('Unable to load the car cascade classifier xml file')

# # Capture video from the default camera (change to 1 if using an external camera)
# cap = cv2.VideoCapture("./videos/UHD 3840x2160 24fps.mp4")

# # Check if the video is opened correctly
# if not cap.isOpened():
#     raise IOError('Unable to open the video capture device')

# # Set video frame rate
# fps = cap.set(cv2.CAP_PROP_FPS, 30)

# # Set video resolution
# cap.set(3, 1920)  # Width
# cap.set(4, 1080)  # Height

# # Setting some prior values
# min_contour_width = 40
# min_contour_height = 40
# offset = 10
# line_height = 550
# matches = []
# cars = 0

# # Function to get the centroid of a contour
# def get_centroid(x, y, w, h):
#     x1 = int(w / 2)
#     y1 = int(h / 2)
#     cx = x + x1
#     cy = y + y1
#     return cx, cy

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     cars_detected = car_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

#     for (x, y, w, h) in cars_detected:
#         cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
#         cx, cy = get_centroid(x, y, w, h)
#         cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)

#         # Count cars crossing the line
#         if line_height - offset <= cy <= line_height + offset:
#             if (x, y, w, h) not in matches:
#                 matches.append((x, y, w, h))
#                 cars += 1

#     # Display the count of cars
#     cv2.putText(frame, f'Cars: {cars}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

#     cv2.imshow('Car Detection', frame)

#     if cv2.waitKey(1) & 0xFF == 27:  # Press 'Esc' to exit
#         break

# cap.release()
# cv2.destroyAllWindows()

# Import libraries
from PIL import Image
import cv2
import numpy as np
import requests  

import cv2

#Load the Haar Cascade classifier for car detection
car_cascade_src = './cars.xml'
car_cascade = cv2.CascadeClassifier(car_cascade_src) 

# Check if the classifier is loaded correctly
if car_cascade.empty():
    raise IOError('Unable to load the car cascade classifier XML file')

# Capture video from the file
video_src = './videos/UHD 3840x2160 24fps.mp4'
cap = cv2.VideoCapture(video_src)

# Check if the video is opened correctly
if not cap.isOpened():
    raise IOError('Unable to open the video file')

# Define the codec and create VideoWriter object
fourcc = cv2.VideoWriter_fourcc(*'DIVX')
out = cv2.VideoWriter('result.avi', fourcc, 10, (450, 250))

while True:
    ret, img = cap.read()
    if not ret:
        break

    # Resize the frame to match the output video dimensions
    img = cv2.resize(img, (450, 250))

    # Convert the frame to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect cars in the frame
    cars = car_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=7)

    # Draw rectangles around detected cars
    for (x, y, w, h) in cars:
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 255), 2)

    # Write the frame to the output video
    out.write(img)

    # Display the frame
    cv2.imshow('Car Detection', img)

    # Break the loop if 'Esc' key is pressed
    if cv2.waitKey(1) & 0xFF == 27:
        break

# Release the video capture and writer objects
cap.release()
out.release()
cv2.destroyAllWindows()
