# import requests
# import math
# import re
# import random
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .serializers import CropPredictionSerializer
# from .models import CropPrediction
# from .ml_service.crop_service import predict_crop_service
# from django.utils import timezone
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.decorators import permission_classes
# from settings.utils import log_analytics_event


# #predict crop
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def predict_crop(request):
#     serializer = CropPredictionSerializer(data=request.data)

#     if not serializer.is_valid():
#         return Response({
#             "message": "Invalid input",
#             "errors": serializer.errors
#         }, status=400)

#     try:
#         data = serializer.validated_data

#         crops = predict_crop_service(data)

#         CropPrediction.objects.create(
#              user=request.user,
#             **data,
#             predicted_crop=crops[0]["name"]
#         )

#         # Analytics
#         log_analytics_event(
#             request.user,
#             "crop_prediction"
#         )

#         return Response({
#             "crop": crops[0]["name"],
#             "crops": crops
#         })

#     except Exception:
#         # ✅ NEVER FAIL
#         return Response({
#             "crop": None,
#             "crops": [],
#             "message": "prediction failed but ignored"
#         }, status=200)



# import random
# import requests

# from requests.adapters import HTTPAdapter
# from urllib3.util.retry import Retry

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response

# from .models import CropPrediction


# # Retry Session
# session = requests.Session()

# retry = Retry(
#     total=3,
#     backoff_factor=1,
#     status_forcelist=[500, 502, 503, 504],
# )

# adapter = HTTPAdapter(max_retries=retry)

# session.mount("https://", adapter)
# session.mount("http://", adapter)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def predict_crop_from_location(request):

#     lat = request.data.get("latitude")
#     lon = request.data.get("longitude")

#     if lat is None or lon is None:
#         return Response(
#             {"message": "Latitude and Longitude required"},
#             status=400,
#         )

#     try:

#         lat = float(lat)
#         lon = float(lon)

#         ############################################################
#         # DEFAULT VALUES
#         ############################################################

#         temperature = 25
#         humidity = 65
#         rainfall = 50

#         ph = 6.5
#         nitrogen = 80

#         ############################################################
#         # WEATHER API
#         ############################################################

#         try:

#             weather_url = (
#                 "https://api.open-meteo.com/v1/forecast"
#                 f"?latitude={lat}"
#                 f"&longitude={lon}"
#                 "&current=temperature_2m,relative_humidity_2m"
#                 "&daily=precipitation_sum"
#                 "&forecast_days=1"
#                 "&timezone=auto"
#             )

#             weather_response = session.get(
#                 weather_url,
#                 timeout=8,
#             )

#             weather_response.raise_for_status()

#             weather_json = weather_response.json()

#             current = weather_json.get("current", {})

#             temperature = current.get(
#                 "temperature_2m",
#                 temperature,
#             )

#             humidity = current.get(
#                 "relative_humidity_2m",
#                 humidity,
#             )

#             rainfall = (
#                 weather_json.get("daily", {})
#                 .get("precipitation_sum", [rainfall])[0]
#             )

#             if rainfall <= 0:
#                 rainfall = 10

#         except Exception as e:

#             print("Weather API Failed:", e)
#             print("Using default weather values.")

#         ############################################################
#         # SOILGRIDS API
#         ############################################################

#         try:

#             soil_url = (
#                 "https://rest.isric.org/soilgrids/v2.0/properties/query"
#                 f"?lat={lat}"
#                 f"&lon={lon}"
#                 "&property=phh2o"
#                 "&property=nitrogen"
#             )

#             soil_response = session.get(
#                 soil_url,
#                 timeout=8,
#             )

#             soil_response.raise_for_status()

#             soil_json = soil_response.json()

#             layers = (
#                 soil_json.get("properties", {})
#                 .get("layers", [])
#             )

#             for layer in layers:

#                 if layer["name"] == "phh2o":

#                     ph = (
#                         layer["depths"][0]["values"]["mean"]
#                         / 10
#                     )

#                 elif layer["name"] == "nitrogen":

#                     nitrogen = int(
#                         layer["depths"][0]["values"]["mean"]
#                     )

#         except Exception as e:

#             print("Soil API Failed:", e)
#             print("Using default soil values.")

#         ############################################################
#         # NORMALIZE VALUES
#         ############################################################

#         N = max(
#             20,
#             min(int(nitrogen), 140),
#         )

#         P = max(
#             5,
#             min(
#                 int(
#                     N * random.uniform(
#                         0.45,
#                         0.70,
#                     )
#                 ),
#                 145,
#             ),
#         )

#         K = max(
#             5,
#             min(
#                 int(
#                     N * random.uniform(
#                         0.60,
#                         1.00,
#                     )
#                 ),
#                 205,
#             ),
#         )

#         ph = round(ph, 1)

#         ############################################################
#         # MODEL INPUT
#         ############################################################

#         input_data = {
#             "N": N,
#             "P": P,
#             "K": K,
#             "temperature": temperature,
#             "humidity": humidity,
#             "ph": ph,
#             "rainfall": rainfall,
#         }

#         print("MODEL INPUT:", input_data)

#         ############################################################
#         # PREDICTION
#         ############################################################

#         crops = predict_crop_service(input_data)
#         print("=" * 60)
#         print("Total crops returned by model:", len(crops))
#         print("Model crops:", [crop["name"] for crop in crops])
#         print("=" * 60)

#         ############################################################
#         # CLIMATE FILTER
#         ############################################################

#         def climate_filter(crops):

#             filtered = []

#             for crop in crops:

#                 name = crop["name"].lower().strip()

#                 if name in [
#                     "apple",
#                     "pear",
#                     "peach",
#                     "plum",
#                     "cherry",
#                 ] and temperature > 22:
#                     continue

#                 if name == "tea" and temperature > 28:
#                     continue

#                 if name == "rice" and rainfall < 80:
#                     continue

#                 if name == "wheat" and temperature > 32:
#                     continue

#                 filtered.append(crop)

#             return filtered

#         filtered = climate_filter(crops)

#         if not filtered:
#             filtered = crops

#         top_crops = filtered[:5]

#         ############################################################
#         # SAVE HISTORY
#         ############################################################

#         CropPrediction.objects.create(
#             user=request.user,
#             N=N,
#             P=P,
#             K=K,
#             temperature=temperature,
#             humidity=humidity,
#             ph=ph,
#             rainfall=rainfall,
#             predicted_crop=top_crops[0]["name"],
#         )

#         ############################################################
#         # ANALYTICS
#         ############################################################

#         try:
#             log_analytics_event(
#                 request.user,
#                 "crop_prediction",
#             )
#         except Exception as e:
#             print(e)

#         ############################################################
#         # RESPONSE
#         ############################################################

#         return Response(
#             {
#                 "crop": top_crops[0]["name"],
#                 "crops": top_crops,
#                 "soil": {
#                     "N": N,
#                     "P": P,
#                     "K": K,
#                     "ph": ph,
#                 },
#                 "weather": {
#                     "temperature": temperature,
#                     "humidity": humidity,
#                     "rainfall": rainfall,
#                 },
#                 "location": {
#                     "latitude": lat,
#                     "longitude": lon,
#                 },
#             }
#         )

#     except Exception as e:

#         print("Prediction Error:", str(e))

#         return Response(
#             {
#                 "message": "Prediction failed",
#                 "error": str(e),
#             },
#             status=500,
#         )

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django.utils import timezone
# import re
# from api.models import CropPrediction


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_prediction_history(request):
#     try:
#         records = CropPrediction.objects.filter(
#             user=request.user
#         ).order_by("-created_at")

#         data = []

#         for item in records:
#             try:
#                 crop = str(item.predicted_crop).strip()

#                 # ❌ ignore null / empty
#                 if not crop or crop.lower() in ["none", "null"]:
#                     continue

#                 # ❌ ignore numbers (VERY IMPORTANT FIX)
#                 if crop.isdigit():
#                     continue

#                 # ❌ ignore float-like values (e.g., "12.0")
#                 if re.match(r'^\d+(\.\d+)?$', crop):
#                     continue

#                 # ❌ ignore corrupted values
#                 if "array" in crop.lower() or "response" in crop.lower():
#                     continue

#                 # 🧹 optional cleaning (safe minimal)
#                 crop = crop.replace("{'crop':", "").replace("}", "").strip()

#                 # ❌ final check
#                 if not crop or crop.isdigit():
#                     continue

#                 data.append({
#                     "crop": crop,
#                     "N": item.N,
#                     "P": item.P,
#                     "K": item.K,
#                     "temperature": item.temperature,
#                     "humidity": item.humidity,
#                     "ph": item.ph,
#                     "rainfall": item.rainfall,
#                     "created_at": timezone.localtime(item.created_at).isoformat()
#                 })

#             except Exception:
#                 continue

#         return Response(data, status=200)

#     except Exception:
#         return Response({
#             "message": "History loaded with safe fallback",
#             "data": []
#         }, status=200)


import logging
import math
import re
import time

import requests

from django.core.cache import cache
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import CropPredictionSerializer
from .models import CropPrediction
from .ml_service.crop_service import predict_crop_service

from settings.utils import log_analytics_event


# ============================================================
# LOGGER
# ============================================================

logger = logging.getLogger(__name__)


# ============================================================
# CONSTANTS
# ============================================================

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

SOILGRIDS_URL = (
    "https://rest.isric.org/soilgrids/v2.0/properties/query"
)

WEATHER_CACHE_SECONDS = 1800       # 30 minutes
SOIL_CACHE_SECONDS = 86400         # 24 hours

CONNECT_TIMEOUT = 3
READ_TIMEOUT = 5


# ============================================================
# HELPER: SAFE ANALYTICS
# ============================================================

def track_prediction_analytics(user):

    try:
        log_analytics_event(
            user,
            "crop_prediction"
        )

    except Exception:
        logger.exception(
            "Crop prediction analytics failed"
        )


# ============================================================
# HELPER: SAFE CACHE
# ============================================================

def get_cached_location_data(
    cache_key,
    url,
    params,
    timeout=READ_TIMEOUT,
    cache_seconds=1800
):
    """
    Fetch external API data with:
    - Django caching
    - Connection timeout
    - Read timeout
    - No automatic retries

    Cache failures do not prevent API requests.
    """

    # Check cache
    try:

        cached_data = cache.get(cache_key)

        if cached_data is not None:

            logger.info(
                "Location API cache hit: %s",
                cache_key
            )

            return cached_data

    except Exception:

        logger.exception(
            "Cache read failed: %s",
            cache_key
        )

    # Fetch API
    response = requests.get(
        url,
        params=params,
        timeout=(CONNECT_TIMEOUT, timeout)
    )

    response.raise_for_status()

    data = response.json()

    # Store cache
    try:

        cache.set(
            cache_key,
            data,
            cache_seconds
        )

    except Exception:

        logger.exception(
            "Cache write failed: %s",
            cache_key
        )

    return data


# ============================================================
# HELPER: SAFE NUMERIC VALUE
# ============================================================

def safe_float(value, default):

    try:

        number = float(value)

        if not math.isfinite(number):
            return default

        return number

    except (TypeError, ValueError, OverflowError):

        return default


# ============================================================
# HELPER: CLIMATE FILTER
# ============================================================

def filter_crops_by_climate(crops, temperature, rainfall):

    filtered = []

    for crop in crops:

        name = str(
            crop.get("name", "")
        ).lower().strip()

        # Cold climate fruits
        if name in [
            "apple",
            "pear",
            "peach",
            "plum",
            "cherry"
        ] and temperature > 22:

            continue

        # Tea
        if name == "tea" and temperature > 28:

            continue

        # Rice
        if name == "rice" and rainfall < 80:

            continue

        # Wheat
        if name == "wheat" and temperature > 32:

            continue

        filtered.append(crop)

    # Preserve original recommendations if filtering
    # removes every crop.

    return filtered if filtered else crops


# ============================================================
# 1. NORMAL CROP PREDICTION
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def predict_crop(request):

    try:

        serializer = CropPredictionSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "message": "Invalid input",
                    "errors": serializer.errors
                },
                status=400
            )

        data = serializer.validated_data

        # ML prediction
        crops = predict_crop_service(data)

        if not crops:

            return Response(
                {
                    "message": "No crop recommendations generated",
                    "crop": None,
                    "crops": []
                },
                status=500
            )

        # Save history
        CropPrediction.objects.create(
            user=request.user,
            **data,
            predicted_crop=crops[0]["name"]
        )

        # Analytics
        track_prediction_analytics(request.user)

        return Response(
            {
                "crop": crops[0]["name"],
                "crops": crops
            },
            status=200
        )

    except Exception:

        logger.exception(
            "Normal crop prediction failed"
        )

        return Response(
            {
                "message": "Crop prediction failed",
                "crop": None,
                "crops": []
            },
            status=500
        )


# ============================================================
# 2. LOCATION-BASED CROP PREDICTION
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def predict_crop_from_location(request):

    start_time = time.perf_counter()

    logger.info(
        "LOCATION PREDICTION: Started"
    )

    try:

        # ----------------------------------------------------
        # STEP 1: VALIDATE COORDINATES
        # ----------------------------------------------------

        lat = safe_float(
            request.data.get("latitude"),
            None
        )

        lon = safe_float(
            request.data.get("longitude"),
            None
        )

        if lat is None or lon is None:

            return Response(
                {
                    "message": "Latitude and longitude are required"
                },
                status=400
            )

        if not (
            -90 <= lat <= 90
            and -180 <= lon <= 180
        ):

            return Response(
                {
                    "message": "Invalid latitude or longitude"
                },
                status=400
            )

        logger.info(
            "LOCATION PREDICTION: Coordinates received"
        )

        # Cache key
        cache_location = f"{lat:.2f}_{lon:.2f}"

        # ----------------------------------------------------
        # STEP 2: DEFAULT VALUES
        # ----------------------------------------------------

        temperature = 25.0
        humidity = 65.0
        rainfall = 50.0

        ph = 6.5
        nitrogen = 80

        # ----------------------------------------------------
        # STEP 3: OPEN-METEO WEATHER API
        # ----------------------------------------------------

        try:

            weather_data = get_cached_location_data(

                cache_key=(
                    f"crop_weather_{cache_location}"
                ),

                url=OPEN_METEO_URL,

                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": (
                        "temperature_2m,"
                        "relative_humidity_2m"
                    ),
                    "daily": "precipitation_sum",
                    "forecast_days": 1,
                    "timezone": "auto"
                },

                timeout=READ_TIMEOUT,

                cache_seconds=WEATHER_CACHE_SECONDS
            )

            current = weather_data.get(
                "current", {}
            )

            temperature = safe_float(
                current.get("temperature_2m"),
                temperature
            )

            humidity = safe_float(
                current.get("relative_humidity_2m"),
                humidity
            )

            daily = (
                weather_data.get("daily", {})
                .get("precipitation_sum", [])
            )

            if daily and daily[0] is not None:

                rainfall = safe_float(
                    daily[0],
                    rainfall
                )

            logger.info(
                "LOCATION PREDICTION: Weather completed in %.2fs",
                time.perf_counter() - start_time
            )

        except (
            requests.RequestException,
            ValueError,
            TypeError,
            KeyError
        ):

            logger.exception(
                "Open-Meteo unavailable. Using default weather."
            )

        # ----------------------------------------------------
        # STEP 4: SOILGRIDS API
        # ----------------------------------------------------

        try:

            soil_data = get_cached_location_data(

                cache_key=(
                    f"crop_soil_{cache_location}"
                ),

                url=SOILGRIDS_URL,

                params=[
                    ("lat", lat),
                    ("lon", lon),
                    ("property", "phh2o"),
                    ("property", "nitrogen")
                ],

                timeout=READ_TIMEOUT,

                cache_seconds=SOIL_CACHE_SECONDS
            )

            layers = (
                soil_data.get("properties", {})
                .get("layers", [])
            )

            for layer in layers:

                depths = layer.get("depths", [])

                if not depths:
                    continue

                mean_value = (
                    depths[0]
                    .get("values", {})
                    .get("mean")
                )

                if mean_value is None:
                    continue

                if layer.get("name") == "phh2o":

                    # SoilGrids pH is commonly represented
                    # in pH multiplied by 10.

                    ph = safe_float(
                        mean_value / 10,
                        ph
                    )

                elif layer.get("name") == "nitrogen":

                    nitrogen = int(
                        safe_float(
                            mean_value,
                            nitrogen
                        )
                    )

            logger.info(
                "LOCATION PREDICTION: Soil completed in %.2fs",
                time.perf_counter() - start_time
            )

        except (
            requests.RequestException,
            ValueError,
            TypeError,
            KeyError,
            IndexError
        ):

            logger.exception(
                "SoilGrids unavailable. Using default soil."
            )

        # ----------------------------------------------------
        # STEP 5: NORMALIZE VALUES
        # ----------------------------------------------------

        N = max(
            20,
            min(int(nitrogen), 140)
        )

        # SoilGrids request currently retrieves only
        # nitrogen and pH.
        #
        # P and K below are estimated fallback inputs,
        # NOT actual SoilGrids measurements.

        P = max(
            5,
            min(int(N * 0.55), 145)
        )

        K = max(
            5,
            min(int(N * 0.80), 205)
        )

        ph = max(
            0.0,
            min(round(ph, 1), 14.0)
        )

        temperature = max(
            -10.0,
            min(temperature, 60.0)
        )

        humidity = max(
            0.0,
            min(humidity, 100.0)
        )

        rainfall = max(
            0.0,
            min(rainfall, 500.0)
        )

        # ----------------------------------------------------
        # STEP 6: PREPARE ML INPUT
        # ----------------------------------------------------

        input_data = {

            "N": N,
            "P": P,
            "K": K,

            "temperature": temperature,
            "humidity": humidity,

            "ph": ph,
            "rainfall": rainfall

        }

        logger.info(
            "LOCATION MODEL INPUT: %s",
            input_data
        )

        # ----------------------------------------------------
        # STEP 7: ML PREDICTION
        # ----------------------------------------------------

        crops = predict_crop_service(
            input_data
        )

        if not crops:

            logger.error(
                "Location prediction returned no crops"
            )

            return Response(
                {
                    "message": "No crop recommendations generated"
                },
                status=500
            )

        logger.info(
            "LOCATION PREDICTION: ML completed in %.2fs",
            time.perf_counter() - start_time
        )

        logger.info(
            "Total crops returned: %s",
            len(crops)
        )

        # ----------------------------------------------------
        # STEP 8: CLIMATE FILTER
        # ----------------------------------------------------

        filtered = filter_crops_by_climate(
            crops,
            temperature,
            rainfall
        )

        # Top 5 crops
        top_crops = filtered[:5]

        # ----------------------------------------------------
        # STEP 9: SAVE PREDICTION HISTORY
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # STEP 10: ANALYTICS
        # ----------------------------------------------------

        track_prediction_analytics(
            request.user
        )

        # ----------------------------------------------------
        # STEP 11: RESPONSE
        # ----------------------------------------------------

        total_time = (
            time.perf_counter() - start_time
        )

        logger.info(
            "LOCATION PREDICTION: Successfully completed in %.2fs",
            total_time
        )

        return Response(

            {

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

            },

            status=200

        )

    except Exception:

        logger.exception(
            "LOCATION PREDICTION FAILED"
        )

        return Response(
            {
                "message": "Location prediction failed"
            },
            status=500
        )


# ============================================================
# 3. USER-SPECIFIC PREDICTION HISTORY
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_prediction_history(request):

    try:

        records = (
            CropPrediction.objects
            .filter(user=request.user)
            .order_by("-created_at")
        )

        data = []

        for item in records:

            try:

                crop = str(
                    item.predicted_crop or ""
                ).strip()

                # Ignore empty values
                if not crop:
                    continue

                # Ignore null values
                if crop.lower() in [
                    "none",
                    "null",
                    "nan"
                ]:
                    continue

                # Ignore numeric values
                if crop.isdigit():
                    continue

                # Ignore float-like values
                if re.match(
                    r"^\d+(\.\d+)?$",
                    crop
                ):
                    continue

                # Ignore corrupted values
                if (
                    "array" in crop.lower()
                    or "response" in crop.lower()
                ):
                    continue

                # Minimal cleanup
                crop = (
                    crop
                    .replace("{'crop':", "")
                    .replace("}", "")
                    .strip()
                )

                if not crop:
                    continue

                if crop.isdigit():
                    continue

                data.append(

                    {

                        "crop": crop,

                        "N": item.N,
                        "P": item.P,
                        "K": item.K,

                        "temperature": item.temperature,
                        "humidity": item.humidity,

                        "ph": item.ph,
                        "rainfall": item.rainfall,

                        "created_at": timezone.localtime(
                            item.created_at
                        ).isoformat()

                    }

                )

            except Exception:

                logger.exception(
                    "Failed to serialize prediction history record %s",
                    item.pk
                )

                continue

        return Response(
            data,
            status=200
        )

    except Exception:

        logger.exception(
            "Prediction history loading failed"
        )

        return Response(
            {
                "message": "Unable to load prediction history",
                "data": []
            },
            status=500
        )
