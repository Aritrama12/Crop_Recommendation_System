from django.db import models

# Create your models here.
from django.db import models

class SoilTest(models.Model):
    image = models.ImageField(upload_to='soil_images/', null=True, blank=True)
    data_file = models.FileField(upload_to='soil_data/', null=True, blank=True)
    notes = models.TextField(blank=True)

    ph = models.FloatField(null=True, blank=True)
    nitrogen = models.FloatField(null=True, blank=True)
    phosphorus = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    moisture = models.FloatField(null=True, blank=True)

    soil_score = models.IntegerField(null=True, blank=True)
    organic_matter = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)