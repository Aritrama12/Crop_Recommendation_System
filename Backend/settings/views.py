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
    

# user location views
from .models import UserLocation
from .serializers import UserLocationSerializer

class UserLocationView(generics.RetrieveUpdateAPIView):
    serializer_class = UserLocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = UserLocation.objects.get_or_create(
            user=self.request.user
        )
        return obj
    

# preferences views
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserPreference
from .serializers import UserPreferenceSerializer


class UserPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pref, created = UserPreference.objects.get_or_create(
            user=request.user
        )

        serializer = UserPreferenceSerializer(pref)
        return Response(serializer.data)

    def put(self, request):
        pref, created = UserPreference.objects.get_or_create(
            user=request.user
        )

        serializer = UserPreferenceSerializer(
            pref,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)