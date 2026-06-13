from settings.models import UserLocation

from settings.utils import (
    check_weather_alerts
)

from .services import (
    get_current_weather
)


def run_weather_checks():

    locations = (
        UserLocation.objects.exclude(
            latitude__isnull=True
        ).exclude(
            longitude__isnull=True
        )
    )

    for location in locations:

        try:

            current = (
                get_current_weather(
                    location.latitude,
                    location.longitude
                )
            )

            check_weather_alerts(
                location.user,
                "Current Location",
                current
            )

            print(
                f"Weather checked for "
                f"{location.user.username}"
            )

        except Exception as e:

            print(
                f"Weather check failed: {e}"
            )