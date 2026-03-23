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
    crop_recommendations = models.BooleanField(default=True)
    soil_analysis = models.BooleanField(default=False)
    market_prices = models.BooleanField(default=True)

    #  Privacy
    location_access = models.BooleanField(default=True)
    share_analytics = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} settings"