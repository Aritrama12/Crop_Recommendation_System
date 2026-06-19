from django.db import models

class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
    



class PendingRegistration(models.Model):
    username = models.CharField(max_length=150)

    email = models.EmailField(unique=True)

    password = models.CharField(max_length=255)

    token = models.CharField(max_length=500, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email