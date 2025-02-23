import tensorflow as tf
import numpy as np
from PIL import Image

interpreter = tf.lite.Interpreter(model_path = 'tf_lite_model.tflite')
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def predict_frame(img):
    # Convert PIL Image to array and preprocess
    img_array = tf.keras.utils.img_to_array(img)
    
    img_array = tf.image.resize(img_array, (250, 250))  # Resize to match model's expected input

    if img_array.shape[-1] == 4:  # If the image has 4 channels (RGBA), convert to RGB
        print(img_array)
        img_array = img_array[:, :, :3]

    img_batch = np.expand_dims(img_array, axis=0)
    
    # Set the input tensor
    interpreter.set_tensor(input_details[0]['index'], img_batch)
    
    # Run inference
    interpreter.invoke()
    
    # Get prediction
    prediction = interpreter.get_tensor(output_details[0]['index'])
    
    # Convert prediction to binary (0 or 1)
    prediction = (prediction > 0.5).astype("int32")
    
    if prediction[0][0] == 0:
        return "Accident Detected"
    else:
        return "No Accident Detected"