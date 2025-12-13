from django.urls import path
from .views import predict_crop

#routes->/predict
urlpatterns = [
    path("predict", predict_crop),
]
