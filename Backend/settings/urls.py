from django.urls import path
from .views import AnalyticsSummaryView, NotificationListView, NotificationPreferenceView
from .views import UserPreferenceView
from .views import UserLocationView , MarkNotificationReadView, UnreadNotificationCountView

   
urlpatterns = [
    path('notifications-settings/', NotificationPreferenceView.as_view(), name='notification-settings'),
    path(
        "notifications/",
        NotificationListView.as_view(),
        name="notifications"
    ),
    path(
        "notifications/<int:notification_id>/read/",
        MarkNotificationReadView.as_view(),
        name="mark-notification-read"
    ),
    path(
        "notifications/unread-count/",
        UnreadNotificationCountView.as_view(),
        name="unread-notification-count"
    ),
    path("location/", UserLocationView.as_view(), name="user-location"),
    path("analytics/", AnalyticsSummaryView.as_view(), name="analytics-summary"),
    path(
        "preferences/",
        UserPreferenceView.as_view(),
        name="preferences"
    ),
]

