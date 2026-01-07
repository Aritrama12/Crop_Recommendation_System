import os
import requests
from datetime import datetime
from dotenv import load_dotenv
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "https://api.tomorrow.io/v4/weather"

WEATHER_CODE_MAP = {
    1000: "Clear",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    8000: "Thunderstorm"
}

def weather_text(code):
    return WEATHER_CODE_MAP.get(code, "Unknown")

@api_view(["GET"])
def weather_now_and_forecast(request):
    city = request.GET.get("city")

    if not city:
        return Response({"error": "City is required"}, status=400)

    cache_key = f"weather:{city.lower()}"
    cached = cache.get(cache_key)

    # 1️⃣ Return fresh cache immediately
    if cached:
        return Response({
            **cached["data"],
            "source": "cache",
            "cached_at": cached["cached_at"]
        })

    headers = {"accept": "application/json"}

    try:
     
        # REALTIME
  
        realtime_res = requests.get(
            f"{BASE_URL}/realtime",
            params={"location": city, "apikey": API_KEY},
            headers=headers,
            timeout=5
        )

        realtime_res.raise_for_status()
        realtime_values = realtime_res.json()["data"]["values"]

        current = {
            "temperature": realtime_values.get("temperature"),
            "humidity": realtime_values.get("humidity"),
            "rain_intensity": realtime_values.get("precipitationIntensity"),
            "weather": weather_text(realtime_values.get("weatherCode"))
        }

       
        # FORECAST
      
        forecast_res = requests.get(
            f"{BASE_URL}/forecast",
            params={"location": city, "timesteps": "1d", "apikey": API_KEY},
            headers=headers,
            timeout=5
        )

        forecast_res.raise_for_status()
        daily = forecast_res.json()["timelines"]["daily"]

        forecast = []
        for day in daily[:5]:
            v = day["values"]
            forecast.append({
                "date": day["time"].split("T")[0],
                "temp_min": v.get("temperatureMin"),
                "temp_max": v.get("temperatureMax"),
                "humidity": v.get("humidityAvg"),
                "rain_probability": v.get("precipitationProbabilityAvg"),
                "weather": weather_text(v.get("weatherCodeMax"))
            })

        response_data = {
            "location": city,
            "current": current,
            "forecast": forecast
        }

        # Cache for 30 minutes
        cache.set(
            cache_key,
            {
                "data": response_data,
                "cached_at": datetime.utcnow().isoformat()
            },
            timeout=60 * 30
        )

        return Response({
            **response_data,
            "source": "live"
        })

    except Exception:
        # 2️⃣ API FAILED → FALL BACK TO STALE CACHE
        stale = cache.get(cache_key, default=None)

        if stale:
            return Response({
                **stale["data"],
                "source": "stale-cache",
                "cached_at": stale["cached_at"],
                "warning": "Live weather unavailable, showing last known data"
            })

        # 3️⃣ No cache at all
        return Response(
            {"error": "Weather service unavailable"},
            status=503
        )











# EXPLANATION:

# The API first checks if the requested city’s weather is stored in cache (30-minute TTL).
# If cached data exists, it immediately returns it as "source": "cache". 
# If not, it calls Tomorrow.io’s realtime API for current weather and forecast API for next 5 days, 
# converts numeric weather codes to text, builds a response, stores it in cache,
# and returns it as "source": "live". If any API call fails, the code attempts to 
# return the last cached data (stale fallback). If no cache exists, it returns a 503
# Service Unavailable error. This design ensures fast responses, reduces API calls,
# handles rate limits, and gracefully degrades during downtime.