from django.urls import path
from .views import NotificationPreferenceView
from .views import UserPreferenceView

urlpatterns = [
    path('', NotificationPreferenceView.as_view(), name='notification-settings'),
    path(
        "preferences/",
        UserPreferenceView.as_view(),
        name="preferences"
    ),
]
