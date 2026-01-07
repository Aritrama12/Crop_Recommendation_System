
import os
import requests
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Load environment variables
load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")  # Put your OpenWeatherMap free API key in .env

@api_view(['GET'])
def seven_day_forecast(request):
    city = request.GET.get('city')
    state = request.GET.get('state')  # Optional, can be empty

    if not city:
        return Response({"error": "City is required"}, status=400)

    # Step 1: Geocoding to get latitude and longitude
    geo_url = (
        f"https://api.openweathermap.org/geo/1.0/direct"
        f"?q={city},{state if state else ''}&limit=1&appid={API_KEY}"
    )
    geo_res = requests.get(geo_url).json()

    if not geo_res:
        return Response({"error": "Invalid location"}, status=404)

    lat = geo_res[0]['lat']
    lon = geo_res[0]['lon']

    # Step 2: 7-day Forecast (Free One Call API 3.0 requires paid plan, so we use daily forecast via 5 day / 3 hour forecast)
    # Free version: 5 day / 3 hour forecast API (https://openweathermap.org/forecast5)
    weather_url = (
        f"https://api.openweathermap.org/data/2.5/forecast"
        f"?lat={lat}&lon={lon}&units=metric&appid={API_KEY}"
    )

    data = requests.get(weather_url).json()

    # Process the 5-day / 3-hour data to approximate daily forecast
    daily_forecast = {}
    for entry in data.get("list", []):
        date = entry["dt_txt"].split(" ")[0]
        if date not in daily_forecast:
            daily_forecast[date] = {
                "temp_min": entry["main"]["temp_min"],
                "temp_max": entry["main"]["temp_max"],
                "weather": entry["weather"][0]["description"]
            }
        else:
            daily_forecast[date]["temp_min"] = min(daily_forecast[date]["temp_min"], entry["main"]["temp_min"])
            daily_forecast[date]["temp_max"] = max(daily_forecast[date]["temp_max"], entry["main"]["temp_max"])

    return Response({
        "location": f"{city}, {state}" if state else city,
        "daily": list(daily_forecast.values())[:7]  # max 5 days available in free plan
    })
