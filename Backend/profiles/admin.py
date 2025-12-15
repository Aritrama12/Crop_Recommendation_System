from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'full_name',
        'phone_number',
        'location',
        'farm_name',
        'specialization',
        'bio',
        'profile_image',
        'experience',
        'farm_size',
        'achievements',
    )
    search_fields = ('user__username', 'user__email', 'full_name')
