from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# schema design of input form
class CropPrediction(models.Model):
    N = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(150)]
    )
    P = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(150)]
    )
    K = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(210)]
    )
    temperature = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(60)]
    )
    humidity = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    ph = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(14)]
    )
    rainfall = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(500)]
    )

    predicted_crop = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.predicted_crop