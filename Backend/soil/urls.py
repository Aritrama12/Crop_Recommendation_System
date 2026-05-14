from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SoilTestViewSet,
    CurrentSoilAnalysisView,
    SoilHistoryView,
    SoilRecommendationsView,
    SoilImageUploadView,
    SoilHealthSummaryView
)

router = DefaultRouter()
router.register(r'tests', SoilTestViewSet, basename='soil-tests')

urlpatterns = [
    path('', include(router.urls)),
    path('current/', CurrentSoilAnalysisView.as_view(), name='current_soil'),
    path('history/', SoilHistoryView.as_view(), name='soil_history'),
    path('recommendations/', SoilRecommendationsView.as_view(), name='soil_recommendations'),
    path('image-analyze/', SoilImageUploadView.as_view(), name='soil_image_analyze'), # completed
    path('health-summary/', SoilHealthSummaryView.as_view(), name='soil_health_summary'),
]
