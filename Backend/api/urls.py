# from django.urls import path
# from .views import predict_crop , predict_crop_from_location, get_prediction_history
  
# urlpatterns = [
#     path("predict", predict_crop),
#     path("predict/location", predict_crop_from_location),
#     path("history", get_prediction_history), 
# ]

from django.urls import path
from .views import (
    predict_crop,
    predict_crop_from_location,
    get_prediction_history
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    # auth
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),

    # crop APIs
    path("predict/", predict_crop, name="predict_crop"),
    path("predict/location/", predict_crop_from_location, name="predict_by_location"),
    path("history/", get_prediction_history, name="history"),
]