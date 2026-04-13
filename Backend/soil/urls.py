from django.urls import path
from .views import UploadSoil, LatestSoil, History

urlpatterns = [
    path('upload/', UploadSoil.as_view()),
    path('latest/', LatestSoil.as_view()),
    path('history/', History.as_view()),
]