from django.urls import path
from .views import predict_crop , predict_crop_from_location, get_prediction_history
  
urlpatterns = [
    path("predict", predict_crop),
    path("predict/location", predict_crop_from_location),
    path("history", get_prediction_history), 
]
