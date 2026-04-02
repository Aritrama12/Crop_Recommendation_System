#manage ml models
import numpy as np
import pickle

model = pickle.load(open("api/ml_models/best_model.pkl", "rb"))
scaler = pickle.load(open("api/ml_models/scaler.pkl", "rb"))

def predict_crop_service(data):
    values = np.array([
        float(data["N"]),
        float(data["P"]),
        float(data["K"]),
        float(data["temperature"]),
        float(data["humidity"]),
        float(data["ph"]),
        float(data["rainfall"])
    ]).reshape(1, -1)

    scaled = scaler.transform(values)

    # 🔥 Get probabilities
    probs = model.predict_proba(scaled)[0]

    # Get crop names
    crops = model.classes_

    # Pair crops with scores
    crop_scores = list(zip(crops, probs))

    # Sort descending
    crop_scores = sorted(crop_scores, key=lambda x: x[1], reverse=True)

    # Top 5
    top5 = crop_scores[:5]

    return [
        {"name": crop, "score": float(score)}
        for crop, score in top5
    ]