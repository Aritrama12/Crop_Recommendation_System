from django.test import TestCase

# Create your tests here.

import tensorflow as tf
import os

MODEL_PATH = os.path.join(
    
    "soil_model",
    "FINAL_SOIL_MODEL.h5"
)

print("Path:", MODEL_PATH)
print("Exists:", os.path.exists(MODEL_PATH))

model = tf.keras.models.load_model(MODEL_PATH, compile=False)

print("✅ LOADED SUCCESS")
