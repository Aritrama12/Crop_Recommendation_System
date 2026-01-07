from django.urls import path
from .views import weather_now_and_forecast

urlpatterns = [
    path('forecast', weather_now_and_forecast),
]
