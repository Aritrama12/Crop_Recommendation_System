from django.urls import path
from .views import NotificationPreferenceView

urlpatterns = [
    path('', NotificationPreferenceView.as_view(), name='notification-settings'),
]
