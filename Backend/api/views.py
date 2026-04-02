import requests
import math
import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CropPredictionSerializer
from .models import CropPrediction
from .ml_service.crop_service import predict_crop_service

@api_view(["POST"])
def predict_crop(request):
    serializer = CropPredictionSerializer(data=request.data)

    # ❌ VALIDATION ERROR
    if not serializer.is_valid():
        formatted_errors = {
            field: msgs[0] for field, msgs in serializer.errors.items()
        }

        return Response({
            "message": "Invalid input",
            "errors": formatted_errors
        }, status=400)

    data = serializer.validated_data

    # ✅ ML Prediction
    crops = predict_crop_service(data)

    # Save only best crop
    CropPrediction.objects.create(
        **data,
        predicted_crop=crops[0]["name"]
    )

    return Response({
        "crop": crops[0]["name"],
        "crops": crops
    })

# 🔥 NEW LOCATION BASED API
@api_view(["POST"])
def predict_crop_from_location(request):
    lat = request.data.get("latitude")
    lon = request.data.get("longitude")

    if not lat or not lon:
        return Response({"message": "Latitude and Longitude required"}, status=400)

    try:
        lat = float(lat)
        lon = float(lon)

        # 🌦 WEATHER API
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        res = requests.get(weather_url)
        weather = res.json()

        temperature = weather.get("current_weather", {}).get("temperature", 25)

        # 🔥 REGION BASED SOIL (MAIN FIX)
        if lat > 25:  # North India
            N = random.randint(80, 140)
            P = random.randint(40, 90)
            K = random.randint(40, 100)

        elif lat > 15:  # Central India
            N = random.randint(50, 100)
            P = random.randint(30, 70)
            K = random.randint(30, 80)

        else:  # South India
            N = random.randint(20, 60)
            P = random.randint(20, 50)
            K = random.randint(20, 60)

        # 🌧 Rainfall variation
        rainfall = abs((lat * 3) % 300)

        # 💧 Humidity variation
        humidity = 50 + abs(int(lat) % 50)

        # 🌱 pH variation
        ph = round(5.5 + random.uniform(0, 2), 1)

        data = {
            "N": N,
            "P": P,
            "K": K,
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall
        }

        print("🔍 INPUT DATA:", data)  # DEBUG

        # 🤖 ML Prediction
        crops = predict_crop_service(data)

        # 🔥 TOP 5 ONLY
        top_crops = crops[:5]

        # Save best crop
        CropPrediction.objects.create(
            **data,
            predicted_crop=top_crops[0]["name"]
        )

        return Response({
            "crop": top_crops[0]["name"],
            "crops": top_crops,
            "location": {
                "latitude": lat,
                "longitude": lon
            }
        })

    except Exception as e:
        print("❌ ERROR:", str(e))
        return Response({
            "message": "Internal server error",
            "error": str(e)
        }, status=500)
    


from django.utils import timezone

@api_view(["GET"])
def get_prediction_history(request):
    records = CropPrediction.objects.all().order_by("-created_at")[:20]

    data = [
        {
            "crop": item.predicted_crop,
            "N": item.N,
            "P": item.P,
            "K": item.K,
            "temperature": item.temperature,
            "humidity": item.humidity,
            "ph": item.ph,
            "rainfall": item.rainfall,

            # ✅ CONVERT TO LOCAL TIME
            "created_at": timezone.localtime(item.created_at)
        }
        for item in records
    ]

    return Response(data)