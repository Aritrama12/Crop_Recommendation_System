from .models import NotificationPreference, AnalyticsEvent, Notification
from datetime import timedelta
from django.utils import timezone
import requests






# it is to reverse geocode lat and lon to city state country using nominatim api
def reverse_geocode(lat, lon):
    url = "https://nominatim.openstreetmap.org/reverse"

    response = requests.get(
        url,
        params={
            "lat": lat,
            "lon": lon,
            "format": "json"
        },
        headers={
            "User-Agent": "CropWise"
        },
        timeout=5
    )

    data = response.json()

    address = data.get("address", {})

    return {
        "city": (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or ""
        ),
        "state": address.get("state", ""),
        "country": address.get("country", "")
    }





def log_analytics_event(user, event_name):
    try:
        pref = NotificationPreference.objects.get(user=user)

        if pref.share_analytics:
            AnalyticsEvent.objects.create(
                user=user,
                event_name=event_name
            )

    except NotificationPreference.DoesNotExist:
        pass




def create_notification(
    user,
    notification_type,
    title,
    message
):
    pref, _ = NotificationPreference.objects.get_or_create(
        user=user
    )

    allowed = False

    if (
        notification_type == "weather"
        and pref.weather_alerts
    ):
        allowed = True

    elif (
        notification_type == "market"
        and pref.market_prices
    ):
        allowed = True

    elif (
        notification_type == "system"
        and pref.systemknowledge_updates
    ):
        allowed = True

    if not allowed:
        return None

    # Prevent duplicates for 6 hours

    six_hours_ago = timezone.now() - timedelta(hours=6)

    already_exists = Notification.objects.filter(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        created_at__gte=six_hours_ago
    ).exists()

    if already_exists:
        return None

    notification = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message
    )

    send_notification_ws(
        user,
        notification
    )

    return notification





def check_weather_alerts(user, city, current):

    precipitation = current.get("precipitation_probability")
    wind_speed = current.get("wind_speed")
    weather_code = current.get("weather_code")

    if precipitation and precipitation >= 70:
        create_notification(
            user,
            "weather",
            "Heavy Rain Alert",
            f"Heavy rainfall is expected in {city}."
        )

    if wind_speed and wind_speed >= 25:
        create_notification(
            user,
            "weather",
            "Strong Wind Alert",
            f"Strong winds detected in {city}."
        )

    if weather_code in [8000, 8001]:
        create_notification(
            user,
            "weather",
            "Thunderstorm Alert",
            f"Thunderstorm conditions detected in {city}."
        )

    if current["temperature"] >= 40:
        create_notification(
            user,
            "weather",
            "Heatwave Alert",
            f"High temperatures detected in {city}."
        )
    
    if current["temperature"] <= 5:
        create_notification(
            user,
            "weather",
            "Cold Wave Alert",
            f"Low temperatures detected in {city}."
        )



from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
def send_notification_ws(
    user,
    notification
):
    

    print("==========")
    print("SEND_NOTIFICATION_WS CALLED")
    print("USER:", user.username)
    print("GROUP:", f"user_{user.id}")
    print("TITLE:", notification.title)


    channel_layer = (
        get_channel_layer()
    )

    print("CHANNEL_LAYER:", channel_layer)

    async_to_sync(
        channel_layer.group_send
    )(
        f"user_{user.id}",
        {
            "type":
            "notification_message",

            "data": {
                "id":
                notification.id,

                "title":
                notification.title,

                "message":
                notification.message,

                "notification_type":
                notification.notification_type,

                "created_at":
                notification.created_at.isoformat()
            }
        }
    )

    print("GROUP_SEND COMPLETE")
    print("==========")