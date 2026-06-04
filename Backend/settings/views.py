from rest_framework import generics, permissions
from .models import NotificationPreference
from .serializers import NotificationPreferenceSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


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
    

    
# analytics views
from .models import AnalyticsEvent

class AnalyticsSummaryView(APIView):

    def get(self, request):

        data = {
            "crop_prediction": AnalyticsEvent.objects.filter(
                event_name="crop_prediction"
            ).count(),

            "weather_check": AnalyticsEvent.objects.filter(
                event_name="weather_check"
            ).count(),

            # "market_trends": AnalyticsEvent.objects.filter(
            #     event_name="market_trends"
            # ).count(),

            "soil_analysis": AnalyticsEvent.objects.filter(
                event_name="soil_analysis"
            ).count(),

            # "system_knowledge": AnalyticsEvent.objects.filter(
            #     event_name="system_knowledge"
            # ).count(),

            "soil_image_analysis": AnalyticsEvent.objects.filter(
                event_name="soil_image_analysis"
            ).count(),

            "soil_health_summary": AnalyticsEvent.objects.filter(
                event_name="soil_health_summary"
            ).count(),
        }

        return Response(data)
    

# preferences views
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