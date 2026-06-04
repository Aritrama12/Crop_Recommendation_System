from django.contrib import admin
from .models import AnalyticsEvent


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