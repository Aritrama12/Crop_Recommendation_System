
import logging

from django.core.management.base import BaseCommand

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

from weather.scheduler import run_weather_checks


logger = logging.getLogger(__name__)


class Command(BaseCommand):

    help = "Runs CropWise hourly weather checks."

    def handle(self, *args, **options):

        scheduler = BlockingScheduler(timezone="UTC")

        scheduler.add_job(
            run_weather_checks,
            trigger=IntervalTrigger(hours=1),
            id="cropwise_weather_checks",
            name="CropWise Weather Checks",
            replace_existing=True,
            max_instances=1,
            coalesce=True,
            misfire_grace_time=300,
        )

        self.stdout.write(
            self.style.SUCCESS(
                "CropWise weather scheduler started."
            )
        )

        self.stdout.write(
            "Weather checks will run every hour."
        )

        try:
            scheduler.start()

        except KeyboardInterrupt:
            self.stdout.write(
                "Stopping CropWise weather scheduler..."
            )

        finally:
            if scheduler.running:
                scheduler.shutdown(wait=True)
