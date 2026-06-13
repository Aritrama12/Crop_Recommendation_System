from django.apps import AppConfig


class WeatherConfig(AppConfig):

    default_auto_field = (
        "django.db.models.BigAutoField"
    )

    name = "weather"

    def ready(self):


        print("WEATHER READY CALLED")

        from apscheduler.schedulers.background import (
            BackgroundScheduler
        )

        from .scheduler import (
            run_weather_checks
        )

        scheduler = (
            BackgroundScheduler()
        )

        scheduler.add_job(
            run_weather_checks,
            "interval",
            hours=1
        )

        print("JOB ADDED")

        scheduler.start()

        print("SCHEDULER STARTED")