from django.contrib.auth.models import User
from django.db import models



# class NotificationPreference(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="notification_pref")

#     weather_alerts = models.BooleanField(default=True)
#     crop_recommendations = models.BooleanField(default=True)
#     soil_analysis = models.BooleanField(default=False)
#     market_prices = models.BooleanField(default=True)

#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.user.username} Preferences"


class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    #  Notifications
    weather_alerts = models.BooleanField(default=True)
    systemknowledge_updates = models.BooleanField(default=False)
    market_prices = models.BooleanField(default=True)

    #  Privacy
    location_access = models.BooleanField(default=True)
    share_analytics = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} settings"



# schema of user location
class UserLocation(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username


# schema of preferences
class UserPreference(models.Model):
    THEME_CHOICES = [
        ("light", "Light"),
        ("dark", "Dark"),
    ]

    UNIT_CHOICES = [
        ("metric", "Metric"),
        ("imperial", "Imperial"),
    ]

    LANGUAGE_CHOICES = [
        ("english", "English"),
        ("bengali", "Bengali"),
        ("hindi", "Hindi"),
    ]

    CURRENCY_CHOICES = [
        ("INR", "Indian Rupee"),
        ("USD", "US Dollar"),
        ("EUR", "Euro"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="preferences"
    )

    theme = models.CharField(
        max_length=20,
        choices=THEME_CHOICES,
        default="light"
    )

    measurement_unit = models.CharField(
        max_length=20,
        choices=UNIT_CHOICES,
        default="metric"
    )

    language = models.CharField(
        max_length=20,
        choices=LANGUAGE_CHOICES,
        default="english"
    )

    timezone = models.CharField(
        max_length=100,
        default="Asia/Kolkata"
    )

    currency = models.CharField(
        max_length=10,
        choices=CURRENCY_CHOICES,
        default="INR"
    )

    def __str__(self):
        return self.user.username