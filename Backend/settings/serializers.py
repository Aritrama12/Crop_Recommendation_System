from rest_framework import serializers
from .models import NotificationPreference
from .models import UserPreference

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = '__all__'
        read_only_fields = ['user']

#preferences
class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = "__all__"
        read_only_fields = ["user"]