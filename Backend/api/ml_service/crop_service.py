# #manage ml models
# import numpy as np
# import pickle

# model = pickle.load(open("api/ml_models/best_model.pkl", "rb"))
# scaler = pickle.load(open("api/ml_models/scaler.pkl", "rb"))

# def predict_crop_service(data):
#     values = np.array([
#         float(data["N"]),
#         float(data["P"]),
#         float(data["K"]),
#         float(data["temperature"]),
#         float(data["humidity"]),
#         float(data["ph"]),
#         float(data["rainfall"])
#     ]).reshape(1, -1)

#     scaled = scaler.transform(values)

#     # 🔥 Get probabilities
#     probs = model.predict_proba(scaled)[0]

#     # Get crop names
#     crops = model.classes_

#     # Pair crops with scores
#     crop_scores = list(zip(crops, probs))

#     # Sort descending
#     crop_scores = sorted(crop_scores, key=lambda x: x[1], reverse=True)

#     # Top 5
#     top5 = crop_scores[:5]

#     return [
#         {"name": crop, "score": float(score)}
#         for crop, score in top5
#     ]

# manage ml models

# import numpy as np
# import pickle
# import os

# # ✅ Paths (safe & dynamic)
# BASE_DIR = os.path.dirname(os.path.dirname(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "ml_models", "best_model.pkl")
# SCALER_PATH = os.path.join(BASE_DIR, "ml_models", "scaler.pkl")


# # ✅ Safe loading function
# def load_pickle(path):
#     if not os.path.exists(path):
#         raise FileNotFoundError(f"❌ File not found: {path}")
#     if os.path.getsize(path) == 0:
#         raise ValueError(f"❌ File is empty: {path}")
#     with open(path, "rb") as f:
#         return pickle.load(f)


# # ✅ Load once (startup)
# model = load_pickle(MODEL_PATH)
# scaler = load_pickle(SCALER_PATH)


# # ✅ Prediction service
# def predict_crop_service(data):
#     try:
#         # Validate input
#         required_fields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
#         for field in required_fields:
#             if field not in data:
#                 return {"error": f"Missing field: {field}"}

#         # Convert to array
#         values = np.array([
#             float(data["N"]),
#             float(data["P"]),
#             float(data["K"]),
#             float(data["temperature"]),
#             float(data["humidity"]),
#             float(data["ph"]),
#             float(data["rainfall"])
#         ]).reshape(1, -1)

#         # Scale input
#         scaled = scaler.transform(values)

#         # Predict probabilities
#         probs = model.predict_proba(scaled)[0]
#         crops = model.classes_

#         # Sort results
#         crop_scores = sorted(zip(crops, probs), key=lambda x: x[1], reverse=True)

#         # Top 5 results
#         return [
#             {
#                 "name": str(crop),       # ✅ ensure JSON safe
#                 "score": round(float(score), 4)  # ✅ cleaner output
#             }
#             for crop, score in crop_scores[:5]
#         ]

#     except Exception as e:
#         return {"error": str(e)}


# import numpy as np
# import pickle
# import os

# # ✅ Paths
# BASE_DIR = os.path.dirname(os.path.dirname(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "ml_models", "best_model.pkl")
# SCALER_PATH = os.path.join(BASE_DIR, "ml_models", "scaler.pkl")
# LABEL_PATH = os.path.join(BASE_DIR, "ml_models", "label_encoder.pkl")  # optional


# # ✅ Safe loader
# def load_pickle(path):
#     if not os.path.exists(path):
#         raise FileNotFoundError(f"❌ File not found: {path}")
#     if os.path.getsize(path) == 0:
#         raise ValueError(f"❌ File is empty: {path}")
#     with open(path, "rb") as f:
#         return pickle.load(f)


# # ✅ Load model & scaler
# model = load_pickle(MODEL_PATH)
# scaler = load_pickle(SCALER_PATH)

# # ✅ Try loading label encoder (optional)
# label_encoder = None
# if os.path.exists(LABEL_PATH) and os.path.getsize(LABEL_PATH) > 0:
#     label_encoder = load_pickle(LABEL_PATH)


# # ✅ Prediction function
# def predict_crop_service(data):
#     try:
#         # 🔍 Validate input
#         required_fields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
#         for field in required_fields:
#             if field not in data:
#                 return {"error": f"Missing field: {field}"}

#         # 🔢 Convert input
#         values = np.array([
#             float(data["N"]),
#             float(data["P"]),
#             float(data["K"]),
#             float(data["temperature"]),
#             float(data["humidity"]),
#             float(data["ph"]),
#             float(data["rainfall"])
#         ]).reshape(1, -1)

#         # ⚙️ Scale
#         scaled = scaler.transform(values)

#         # 📊 Predict
#         probs = model.predict_proba(scaled)[0]

#         # 🧠 Get crop names properly
#         if label_encoder:
#             crop_scores = [
#                 (label_encoder.inverse_transform([i])[0], prob)
#                 for i, prob in enumerate(probs)
#             ]
#         else:
#             # fallback (works if model trained with string labels)
#             crops = model.classes_
#             crop_scores = list(zip(crops, probs))

#         # 📉 Sort
#         crop_scores = sorted(crop_scores, key=lambda x: x[1], reverse=True)

#         # 🏆 Top 5
#         return [
#             {
#                 "name": str(crop),
#                 "score": round(float(score), 4)
#             }
#             for crop, score in crop_scores[:5]
#         ]

#     except Exception as e:
#         return {"error": str(e)}

import numpy as np
import pickle
import os

# ================================
# 📁 PATH SETUP
# ================================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "ml_models", "best_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ml_models", "scaler.pkl")
LABEL_PATH = os.path.join(BASE_DIR, "ml_models", "label_encoder.pkl")  # optional


# ================================
# 🔐 SAFE LOADER
# ================================
def load_pickle(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"❌ File not found: {path}")
    if os.path.getsize(path) == 0:
        raise ValueError(f"❌ File is empty: {path}")
    with open(path, "rb") as f:
        return pickle.load(f)


# ================================
# 📦 LOAD MODEL FILES
# ================================
model = load_pickle(MODEL_PATH)
scaler = load_pickle(SCALER_PATH)

label_encoder = None
if os.path.exists(LABEL_PATH) and os.path.getsize(LABEL_PATH) > 0:
    label_encoder = load_pickle(LABEL_PATH)


# ================================
# 🌱 FALLBACK CROP NAMES (ONLY IF NO ENCODER)
# ================================
CROP_NAMES = [
    "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas",
    "mothbeans", "mungbean", "blackgram", "lentil", "pomegranate",
    "banana", "mango", "grapes", "watermelon", "muskmelon",
    "apple", "orange", "papaya", "coconut", "cotton",
    "jute", "coffee"
]


# ================================
# 🚀 MAIN PREDICTION FUNCTION
# ================================
def predict_crop_service(data):
    try:
        # ----------------------------
        # 🔍 Validate Input
        # ----------------------------
        required_fields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

        for field in required_fields:
            if field not in data:
                return {"error": f"Missing field: {field}"}

        # ----------------------------
        # 🔢 Convert Input
        # ----------------------------
        values = np.array([
            float(data["N"]),
            float(data["P"]),
            float(data["K"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"])
        ]).reshape(1, -1)

        # ----------------------------
        # ⚙️ Scale Input
        # ----------------------------
        scaled = scaler.transform(values)

        # ----------------------------
        # 📊 Predict Probabilities
        # ----------------------------
        probs = model.predict_proba(scaled)[0]

        # ----------------------------
        # 🧠 Map to Crop Names (FIXED)
        # ----------------------------
        if label_encoder:
            # ✅ BEST: Use encoder
            crop_scores = [
                (label_encoder.inverse_transform([cls])[0], prob)
                for cls, prob in zip(model.classes_, probs)
            ]

        else:
            # ⚠️ Fallback
            if isinstance(model.classes_[0], str):
                crop_scores = list(zip(model.classes_, probs))
            else:
                # last fallback if numeric classes
                crop_scores = list(zip(CROP_NAMES, probs))

        # ----------------------------
        # 📉 Sort by Probability
        # ----------------------------
        crop_scores = sorted(crop_scores, key=lambda x: x[1], reverse=True)

        # ----------------------------
        # 🏆 Return Top 5
        # ----------------------------
        return [
            {
                "name": str(crop),
                "score": round(float(score), 4)
            }
            for crop, score in crop_scores[:5]
        ]

    except Exception as e:
        return {"error": str(e)}