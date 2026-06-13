import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "https://api.tomorrow.io/v4/weather"


def get_current_weather(latitude, longitude):

    headers = {
        "accept": "application/json"
    }

    response = requests.get(
        f"{BASE_URL}/realtime",
        params={
            "location":
            f"{latitude},{longitude}",
            "apikey":
            API_KEY
        },
        headers=headers,
        timeout=5
    )

    response.raise_for_status()

    values = response.json()["data"]["values"]

    return {
        "temperature":
        values.get("temperature"),

        "precipitation_probability":
        values.get(
            "precipitationProbability"
        ),

        "wind_speed":
        values.get("windSpeed"),

        "weather_code":
        values.get("weatherCode")
    }