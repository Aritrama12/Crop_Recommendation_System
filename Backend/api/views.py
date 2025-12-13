
# Create your views here.
import numpy as np
import pickle
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Load ML components
model = pickle.load(open("api/ml_models/best_model.pkl", "rb"))
scaler = pickle.load(open("api/ml_models/scaler.pkl", "rb"))
label_encoder = pickle.load(open("api/ml_models/le.pkl", "rb"))

#Controller-> Rest api-> /post 
@api_view(["POST"])
def predict_crop(request):
    try:
        data = request.data

        feature_values = np.array([
            data["N"],
            data["P"],
            data["K"],
            data["temperature"],
            data["humidity"],
            data["ph"],
            data["rainfall"]
        ], dtype=float).reshape(1, -1)

        # Scale Input
        scaled_values = scaler.transform(feature_values)
        # Predict
        prediction = model.predict(scaled_values)
       
        return Response({"crop": prediction})

    except Exception as e:
        return Response({"error": str(e)}, status=500)

