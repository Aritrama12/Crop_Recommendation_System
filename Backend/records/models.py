from django.db import models
from django.conf import settings


class PlantingRecord(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="planting_records"
    )

    planting_date = models.DateField()
    crop = models.CharField(max_length=100)
    field_name = models.CharField(max_length=100)
    area = models.FloatField()
    expected_yield = models.FloatField()

    def __str__(self):
        return f"{self.crop} - {self.user.username}"


class HarvestRecord(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="harvest_records"
    )

    harvest_date = models.DateField()
    crop = models.CharField(max_length=100)
    field_name = models.CharField(max_length=100)
    area = models.FloatField()
    total_harvest = models.FloatField()
    quality = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.crop} - {self.user.username}"


class SaleRecord(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sale_records"
    )

    sale_date = models.DateField()
    crop = models.CharField(max_length=100)
    quantity = models.FloatField()
    price_per_ton = models.FloatField()
    buyer = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.crop} - {self.user.username}"


class ExpenseRecord(models.Model):
    CATEGORY_CHOICES = [
        ("Seeds", "Seeds"),
        ("Fertilizer", "Fertilizer"),
        ("Labor", "Labor"),
        ("Equipment", "Equipment"),
        ("Other", "Other"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="expense_records"
    )

    date = models.DateField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    amount = models.FloatField()
    description = models.TextField()

    def __str__(self):
        return f"{self.category} - {self.user.username}"


class ResourceUsage(models.Model):
    RESOURCE_CHOICES = [
        ("Water", "Water"),
        ("Fertilizer", "Fertilizer"),
        ("Pesticide", "Pesticide"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resource_records"
    )

    date = models.DateField()
    resource_type = models.CharField(
        max_length=50,
        choices=RESOURCE_CHOICES
    )

    quantity = models.FloatField()
    unit = models.CharField(max_length=50)
    field_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.resource_type} - {self.user.username}"