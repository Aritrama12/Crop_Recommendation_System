from rest_framework import generics, permissions
from .models import Notification, NotificationPreference
from .serializers import NotificationPreferenceSerializer, NotificationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .utils import reverse_geocode

# notification section ==========
# notification preference view (it is used to get and update notification preferences of a user)
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
    
# notification list view (in simple language it is used to show all
#  notifications of a user in the notification center)
class NotificationListView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        notifications = Notification.objects.filter(
            user=request.user
        ).order_by('-created_at')

        serializer = NotificationSerializer(
            notifications,
            many=True
        )

        return Response(serializer.data)
    


# mark notification as read
from rest_framework import status
class MarkNotificationReadView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, notification_id):

        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )

            notification.is_read = True
            notification.save()

            return Response(
                {"message": "Notification marked as read"},
                status=status.HTTP_200_OK
            )

        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        


# unread notification count
class UnreadNotificationCountView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()

        return Response({
            "unread_count": count
        })
    


# privacy section ==========
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
    
    def perform_update(self, serializer):

        latitude = serializer.validated_data.get("latitude")
        longitude = serializer.validated_data.get("longitude")

        geo = reverse_geocode(
            latitude,
            longitude
        )

        serializer.save(
            city=geo["city"],
            state=geo["state"],
            country=geo["country"]
        )
    

    
# analytics views
from .models import AnalyticsEvent

class AnalyticsSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]
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
    

# preferences views ==========
from rest_framework.permissions import IsAuthenticated
from .models import UserPreference
from .serializers import UserPreferenceSerializer

# user preference view (it is used to get and update user preferences like language, theme etc.)
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