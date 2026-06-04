from .models import NotificationPreference, AnalyticsEvent


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