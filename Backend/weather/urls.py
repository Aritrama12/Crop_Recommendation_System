from django.urls import path
from .views import seven_day_forecast

urlpatterns = [
    path('forecast', seven_day_forecast),
]
