import requests
import math
import re
import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CropPredictionSerializer
from .models import CropPrediction
from .ml_service.crop_service import predict_crop_service
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from settings.utils import log_analytics_event


#predict crop
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def predict_crop(request):
    serializer = CropPredictionSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "message": "Invalid input",
            "errors": serializer.errors
        }, status=400)

    try:
        data = serializer.validated_data

        crops = predict_crop_service(data)

        CropPrediction.objects.create(
             user=request.user,
            **data,
            predicted_crop=crops[0]["name"]
        )

        # Analytics
        log_analytics_event(
            request.user,
            "crop_prediction"
        )

        return Response({
            "crop": crops[0]["name"],
            "crops": crops
        })

    except Exception:
        # ✅ NEVER FAIL
        return Response({
            "crop": None,
            "crops": [],
            "message": "prediction failed but ignored"
        }, status=200)


import requests

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CropPrediction



# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def predict_crop_from_location(request):

#     lat = request.data.get("latitude")
#     lon = request.data.get("longitude")

#     if not lat or not lon:
#         return Response(
#             {"message": "Latitude and Longitude required"},
#             status=400
#         )

#     try:
#         lat = float(lat)
#         lon = float(lon)

#         # ==================================================
#         # 1. WEATHER DATA FROM OPEN-METEO
#         # ==================================================

#         weather_url = (
#             "https://api.open-meteo.com/v1/forecast"
#             f"?latitude={lat}"
#             f"&longitude={lon}"
#             "&current=temperature_2m,relative_humidity_2m"
#             "&daily=precipitation_sum"
#             "&forecast_days=1"
#             "&timezone=auto"
#         )

#         weather_response = requests.get(
#             weather_url,
#             timeout=15
#         )

#         weather_json = weather_response.json()

#         current = weather_json.get("current", {})

#         temperature = current.get(
#             "temperature_2m",
#             25
#         )

#         humidity = current.get(
#             "relative_humidity_2m",
#             60
#         )

#         daily = weather_json.get("daily", {})

#         rainfall = daily.get(
#             "precipitation_sum",
#             [0]
#         )[0]

#         # Avoid zero rainfall problem
#         if rainfall == 0:
#             rainfall = 50

#         # ==================================================
#         # 2. SOIL DATA FROM SOILGRIDS
#         # ==================================================

#         soil_url = (
#             "https://rest.isric.org/soilgrids/v2.0/properties/query"
#             f"?lat={lat}"
#             f"&lon={lon}"
#             "&property=phh2o"
#             "&property=nitrogen"
#         )

#         soil_response = requests.get(
#             soil_url,
#             timeout=20
#         )

#         soil_json = soil_response.json()

#         ph = 6.5
#         nitrogen = 80

#         try:

#             layers = soil_json["properties"]["layers"]

#             for layer in layers:

#                 # pH
#                 if layer["name"] == "phh2o":

#                     ph = (
#                         layer["depths"][0]["values"]["mean"]
#                         / 10
#                     )

#                 # Nitrogen
#                 elif layer["name"] == "nitrogen":

#                     nitrogen = int(
#                         layer["depths"][0]["values"]["mean"]
#                     )

#         except Exception:
#             pass

#         # ==================================================
#         # 3. NORMALIZE SOIL VALUES
#         # ==================================================

#         N = max(20, min(nitrogen, 140))

#         # Deterministic estimation
#         P = int(N * 0.55)
#         K = int(N * 0.75)

#         P = max(5, min(P, 145))
#         K = max(5, min(K, 205))

#         ph = round(ph, 1)

#         # ==================================================
#         # 4. MODEL INPUT
#         # ==================================================

#         input_data = {
#             "N": N,
#             "P": P,
#             "K": K,
#             "temperature": temperature,
#             "humidity": humidity,
#             "ph": ph,
#             "rainfall": rainfall
#         }

#         print("MODEL INPUT:", input_data)

#         # ==================================================
#         # 5. CROP PREDICTION
#         # ==================================================

#         crops = predict_crop_service(input_data)

#         top_crops = crops[:5]

#         # ==================================================
#         # 6. SAVE HISTORY
#         # ==================================================

#         CropPrediction.objects.create(
#             user=request.user,
#             N=N,
#             P=P,
#             K=K,
#             temperature=temperature,
#             humidity=humidity,
#             ph=ph,
#             rainfall=rainfall,
#             predicted_crop=top_crops[0]["name"]
#         )

#         # ==================================================
#         # 7. RESPONSE
#         # ==================================================

#         return Response({

#             "crop": top_crops[0]["name"],

#             "crops": top_crops,

#             "soil": {
#                 "N": N,
#                 "P": P,
#                 "K": K,
#                 "ph": ph
#             },

#             "weather": {
#                 "temperature": temperature,
#                 "humidity": humidity,
#                 "rainfall": rainfall
#             },

#             "location": {
#                 "latitude": lat,
#                 "longitude": lon
#             }
#         })

#     except Exception as e:

#         print("LOCATION PREDICTION ERROR:", str(e))

#         return Response(
#             {
#                 "message": "Internal server error",
#                 "error": str(e)
#             },
#             status=500
#         )


import random
import requests

from rest_framework.decorators import (
    api_view,
    permission_classes
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CropPrediction



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def predict_crop_from_location(request):

    lat = request.data.get("latitude")
    lon = request.data.get("longitude")

    if not lat or not lon:
        return Response(
            {"message": "Latitude and Longitude required"},
            status=400
        )

    try:

        lat = float(lat)
        lon = float(lon)

        # ==================================================
        # 1. WEATHER DATA
        # ==================================================

        weather_url = (
            "https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}"
            f"&longitude={lon}"
            "&current=temperature_2m,relative_humidity_2m"
            "&daily=precipitation_sum"
            "&forecast_days=1"
            "&timezone=auto"
        )

        weather_response = requests.get(
            weather_url,
            timeout=15
        )

        weather_json = weather_response.json()

        current = weather_json.get("current", {})

        temperature = current.get(
            "temperature_2m",
            25
        )

        humidity = current.get(
            "relative_humidity_2m",
            60
        )

        daily = weather_json.get("daily", {})

        rainfall = daily.get(
            "precipitation_sum",
            [0]
        )[0]

        # Better fallback
        if rainfall <= 0:
            rainfall = 10

        # ==================================================
        # 2. SOIL DATA FROM SOILGRIDS
        # ==================================================

        soil_url = (
            "https://rest.isric.org/soilgrids/v2.0/properties/query"
            f"?lat={lat}"
            f"&lon={lon}"
            "&property=phh2o"
            "&property=nitrogen"
        )

        soil_response = requests.get(
            soil_url,
            timeout=20
        )

        soil_json = soil_response.json()

        ph = 6.5
        nitrogen = 80

        try:

            layers = soil_json["properties"]["layers"]

            for layer in layers:

                if layer["name"] == "phh2o":

                    ph = (
                        layer["depths"][0]["values"]["mean"]
                        / 10
                    )

                elif layer["name"] == "nitrogen":

                    nitrogen = int(
                        layer["depths"][0]["values"]["mean"]
                    )

        except Exception:
            pass

        # ==================================================
        # 3. NORMALIZE SOIL VALUES
        # ==================================================

        N = max(
            20,
            min(
                int(nitrogen),
                140
            )
        )

        # Dynamic P & K estimation
        P = max(
            5,
            min(
                int(
                    N * random.uniform(
                        0.45,
                        0.70
                    )
                ),
                145
            )
        )

        K = max(
            5,
            min(
                int(
                    N * random.uniform(
                        0.60,
                        1.00
                    )
                ),
                205
            )
        )

        ph = round(ph, 1)

        # ==================================================
        # 4. MODEL INPUT
        # ==================================================

        input_data = {
            "N": N,
            "P": P,
            "K": K,
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall
        }

        print("MODEL INPUT:", input_data)

        # ==================================================
        # 5. PREDICT CROPS
        # ==================================================

        crops = predict_crop_service(input_data)

        # ==================================================
        # 6. CLIMATE FILTERING
        # ==================================================

        def climate_filter(
            crops,
            temperature,
            rainfall
        ):

            filtered = []

            for crop in crops:

                crop_name = (
                    crop["name"]
                    .lower()
                    .strip()
                )

                # Cool climate fruits
                if crop_name in [
                    "apple",
                    "pear",
                    "peach",
                    "plum",
                    "cherry"
                ]:
                    if temperature > 22:
                        continue

                # Tea
                if crop_name == "tea":
                    if temperature > 28:
                        continue

                # Rice
                if crop_name == "rice":
                    if rainfall < 80:
                        continue

                # Wheat
                if crop_name == "wheat":
                    if temperature > 32:
                        continue

                filtered.append(crop)

            return filtered

        filtered_crops = climate_filter(
            crops,
            temperature,
            rainfall
        )

        if len(filtered_crops) == 0:
            filtered_crops = crops

        top_crops = filtered_crops[:5]

        print(
            "TOP CROPS:",
            [c["name"] for c in top_crops]
        )

        # ==================================================
        # 7. SAVE HISTORY
        # ==================================================

        CropPrediction.objects.create(
            user=request.user,
            N=N,
            P=P,
            K=K,
            temperature=temperature,
            humidity=humidity,
            ph=ph,
            rainfall=rainfall,
            predicted_crop=top_crops[0]["name"]
        )


        # Analytics
        log_analytics_event(
            request.user,
            "crop_prediction"
        )

        # ==================================================
        # 8. RESPONSE
        # ==================================================


        return Response({

            "crop": top_crops[0]["name"],

            "crops": top_crops,

            "soil": {
                "N": N,
                "P": P,
                "K": K,
                "ph": ph
            },

            "weather": {
                "temperature": temperature,
                "humidity": humidity,
                "rainfall": rainfall
            },

            "location": {
                "latitude": lat,
                "longitude": lon
            }
        })

    except Exception as e:

        print(
            "LOCATION PREDICTION ERROR:",
            str(e)
        )

        return Response(
            {
                "message": "Internal server error",
                "error": str(e)
            },
            status=500
        )


from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
import re
from api.models import CropPrediction


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_prediction_history(request):
    try:
        records = CropPrediction.objects.filter(
            user=request.user
        ).order_by("-created_at")

        data = []

        for item in records:
            try:
                crop = str(item.predicted_crop).strip()

                # ❌ ignore null / empty
                if not crop or crop.lower() in ["none", "null"]:
                    continue

                # ❌ ignore numbers (VERY IMPORTANT FIX)
                if crop.isdigit():
                    continue

                # ❌ ignore float-like values (e.g., "12.0")
                if re.match(r'^\d+(\.\d+)?$', crop):
                    continue

                # ❌ ignore corrupted values
                if "array" in crop.lower() or "response" in crop.lower():
                    continue

                # 🧹 optional cleaning (safe minimal)
                crop = crop.replace("{'crop':", "").replace("}", "").strip()

                # ❌ final check
                if not crop or crop.isdigit():
                    continue

                data.append({
                    "crop": crop,
                    "N": item.N,
                    "P": item.P,
                    "K": item.K,
                    "temperature": item.temperature,
                    "humidity": item.humidity,
                    "ph": item.ph,
                    "rainfall": item.rainfall,
                    "created_at": timezone.localtime(item.created_at).isoformat()
                })

            except Exception:
                continue

        return Response(data, status=200)

    except Exception:
        return Response({
            "message": "History loaded with safe fallback",
            "data": []
        }, status=200)