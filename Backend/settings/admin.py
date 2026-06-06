from django.contrib import admin
from .models import AnalyticsEvent, UserLocation, UserPreference
from .models import Notification, NotificationPreference

admin.site.register(Notification)
admin.site.register(NotificationPreference) 
admin.site.register(UserLocation)
admin.site.register(UserPreference)

@admin.register(AnalyticsEvent)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "event_name",
        "created_at"
    )

    list_filter = (
        "event_name",
        "created_at"
    )