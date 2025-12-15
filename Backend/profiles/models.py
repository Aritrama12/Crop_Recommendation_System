# profiles/models.py
from django.conf import settings
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    full_name = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=150, blank=True)
    farm_name = models.CharField(max_length=150, blank=True)
    specialization = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    profile_image = models.ImageField(
        upload_to='profiles/',
        null=True,
        blank=True
    )

    experience = models.CharField(max_length=50, blank=True)
    farm_size = models.CharField(max_length=50, blank=True)
    achievements = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Profile"
