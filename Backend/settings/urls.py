from django.urls import path
from .views import AnalyticsSummaryView, NotificationPreferenceView
from .views import UserPreferenceView
from .views import UserLocationView

urlpatterns = [
    path('notifications/', NotificationPreferenceView.as_view(), name='notification-settings'),
    path("location/", UserLocationView.as_view(), name="user-location"),
    path("analytics/", AnalyticsSummaryView.as_view(), name="analytics-summary"),
    path(
        "preferences/",
        UserPreferenceView.as_view(),
        name="preferences"
    ),
]

