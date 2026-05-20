from django.contrib import admin
from .models import SoilTest, SoilRecommendation, SoilImage


@admin.register(SoilTest)
class SoilTestAdmin(admin.ModelAdmin):
    list_display = ['field_name', 'user', 'test_date', 'nitrogen', 'phosphorus', 'potassium', 'ph', 'status']
    list_filter = ['status', 'test_date', 'soil_type']
    search_fields = ['field_name', 'user__email']


@admin.register(SoilRecommendation)
class SoilRecommendationAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'soil_test', 'created_at']
    list_filter = ['category', 'priority']
    search_fields = ['title', 'description']


@admin.register(SoilImage)
class SoilImageAdmin(admin.ModelAdmin):
    list_display = ['user', 'field_name', 'analyzed', 'predicted_soil_type', 'uploaded_at']
    list_filter = ['analyzed', 'predicted_soil_type']
