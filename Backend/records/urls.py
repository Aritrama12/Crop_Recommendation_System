from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()

router.register(
    "plantings",
    PlantingViewSet,
    basename="plantings"
)

router.register(
    "harvests",
    HarvestViewSet,
    basename="harvests"
)

router.register(
    "sales",
    SaleViewSet,
    basename="sales"
)

router.register(
    "expenses",
    ExpenseViewSet,
    basename="expenses"
)

router.register(
    "resources",
    ResourceViewSet,
    basename="resources"
)

urlpatterns = [
    path("", include(router.urls)),
]