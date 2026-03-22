from rest_framework import generics, permissions
from .models import NotificationPreference
from .serializers import NotificationPreferenceSerializer

class NotificationPreferenceView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    # def get_object(self):
    #     return NotificationPreference.objects.get(user=self.request.user)
    
    def get_object(self):
        obj, created = NotificationPreference.objects.get_or_create(
            user=self.request.user
        )
        return obj