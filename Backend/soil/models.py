

from django.db import models
from django.conf import settings


# =====================================================
# SOIL TEST MODEL
# =====================================================
class SoilTest(models.Model):
    """Stores soil test records."""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("scheduled", "Scheduled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="soil_tests",
        null=True,
        blank=True
    )

    # Location
    field_name = models.CharField(max_length=100, default="Unknown Field")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # Test info
    test_date = models.DateField()
    lab_name = models.CharField(max_length=200, null=True, blank=True)
    sample_id = models.CharField(max_length=100, null=True, blank=True)

    # Macronutrients
    nitrogen = models.FloatField(default=0)
    phosphorus = models.FloatField(default=0)
    potassium = models.FloatField(default=0)

    # Soil properties
    ph = models.FloatField(default=7)
    organic_carbon = models.FloatField(null=True, blank=True)
    moisture = models.FloatField(null=True, blank=True)

    # Micronutrients
    sulfur = models.FloatField(null=True, blank=True)
    zinc = models.FloatField(null=True, blank=True)
    iron = models.FloatField(null=True, blank=True)
    manganese = models.FloatField(null=True, blank=True)
    copper = models.FloatField(null=True, blank=True)
    boron = models.FloatField(null=True, blank=True)

    # Classification
    soil_type = models.CharField(max_length=100, null=True, blank=True)
    texture = models.CharField(max_length=100, null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="completed"
    )

    notes = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-test_date", "-created_at"]

    def __str__(self):
        return f"{self.field_name} - {self.test_date}"


# =====================================================
# SOIL RECOMMENDATION MODEL (FIXED SAFE VERSION)
# =====================================================
class SoilRecommendation(models.Model):
    """AI-generated soil recommendations (fertilizer / amendment / general)."""

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    CATEGORY_CHOICES = [
        ("fertilizer", "Fertilizer"),
        ("amendment", "Soil Amendment"),
        ("irrigation", "Irrigation"),
        ("crop", "Crop"),
        ("general", "General"),
    ]

    soil_test = models.ForeignKey(
        SoilTest,
        on_delete=models.CASCADE,
        related_name="recommendations"
    )

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)

    title = models.CharField(max_length=200)
    description = models.TextField()
    action_required = models.TextField(null=True, blank=True)

    product_name = models.CharField(max_length=200, null=True, blank=True)
    quantity = models.CharField(max_length=100, null=True, blank=True)

    estimated_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


# =====================================================
# CROP RECOMMENDATION MODEL (SAFE + FRONTEND READY)
# =====================================================
class CropRecommendation(models.Model):
    """Stores crop suggestions based on soil nutrients."""

    soil_test = models.ForeignKey(
        SoilTest,
        on_delete=models.CASCADE,
        related_name="crop_recommendations"
    )

    crop_name = models.CharField(max_length=100)

    soil_reason = models.TextField(null=True, blank=True)
    nutrient_notes = models.TextField(null=True, blank=True)
    climate_notes = models.TextField(null=True, blank=True)

    # IMPORTANT: optional safe JSON field
    extra_data = models.JSONField(default=dict, blank=True, null=True)

    suitability_score = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-suitability_score", "-created_at"]

    def __str__(self):
        return self.crop_name


# =====================================================
# SOIL IMAGE MODEL
# =====================================================
class SoilImage(models.Model):
    """AI-based soil image analysis."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="soil_images",
        null=True,
        blank=True
    )

    soil_test = models.ForeignKey(
        SoilTest,
        on_delete=models.SET_NULL,
        related_name="images",
        null=True,
        blank=True
    )

    image = models.ImageField(upload_to="soil_images/")
    field_name = models.CharField(max_length=100, null=True, blank=True)

    analyzed = models.BooleanField(default=False)

    predicted_soil_type = models.CharField(max_length=100, null=True, blank=True)
    predicted_moisture = models.CharField(max_length=50, null=True, blank=True)
    predicted_fertility = models.CharField(max_length=50, null=True, blank=True)

    confidence = models.FloatField(null=True, blank=True)

    analysis_data = models.JSONField(default=dict, blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)
    analyzed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"Soil Image #{self.id}"