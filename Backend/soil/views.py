
# from rest_framework import generics, status, viewsets
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser
# from django.utils import timezone

# from .models import SoilTest, SoilRecommendation, SoilImage
# from .serializers import (
#     SoilTestSerializer,
#     SoilTestCreateSerializer,
#     SoilRecommendationSerializer,
#     SoilImageSerializer,
#     SoilImageUploadSerializer,
#     SoilImageAnalysisResultSerializer
# )
# from .services import SoilAnalysisService, SoilImageAnalyzer


# # ==========================================================
# # SOIL TEST CRUD
# # ==========================================================
# class SoilTestViewSet(viewsets.ModelViewSet):
#     queryset = SoilTest.objects.all().order_by('-created_at')

#     def get_serializer_class(self):
#         if self.action in ['create', 'update', 'partial_update']:
#             return SoilTestCreateSerializer
#         return SoilTestSerializer

#     def perform_create(self, serializer):
#         soil_test = serializer.save()

#         service = SoilAnalysisService()
#         recommendations = service.analyze_soil_test(soil_test)

#         for rec in recommendations:
#             SoilRecommendation.objects.create(
#                 soil_test=soil_test,
#                 **rec
#             )


# # ==========================================================
# # CURRENT SOIL ANALYSIS
# # ==========================================================
# class CurrentSoilAnalysisView(APIView):

#     def get(self, request):
#         soil_test = SoilTest.objects.filter(
#             status='completed'
#         ).first()

#         if not soil_test:
#             return Response(
#                 {"message": "No completed soil tests found."},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         serializer = SoilTestSerializer(soil_test)
#         return Response(serializer.data)


# # ==========================================================
# # SOIL HISTORY
# # ==========================================================
# class SoilHistoryView(generics.ListAPIView):
#     serializer_class = SoilTestSerializer

#     def get_queryset(self):
#         return SoilTest.objects.all().order_by('-created_at')


# # ==========================================================
# # SOIL RECOMMENDATIONS
# # ==========================================================
# class SoilRecommendationsView(generics.ListAPIView):
#     serializer_class = SoilRecommendationSerializer

#     def get_queryset(self):
#         return SoilRecommendation.objects.all().order_by(
#             '-priority',
#             '-created_at'
#         )[:20]


# # ==========================================================
# # IMAGE ANALYSIS
# # ==========================================================
# class SoilImageUploadView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request):
#         serializer = SoilImageUploadSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         soil_image = SoilImage.objects.create(
#             **serializer.validated_data
#         )

#         analyzer = SoilImageAnalyzer()
#         result = analyzer.analyze_image(
#             soil_image.image.path
#         )

#         soil_image.analyzed = True
#         soil_image.predicted_soil_type = result['soil_type']
#         soil_image.predicted_moisture = result['moisture']
#         soil_image.predicted_fertility = result['fertility']
#         soil_image.confidence = result['confidence']
#         soil_image.analysis_data = result['analysis_data']
#         soil_image.analyzed_at = timezone.now()
#         soil_image.save()

#         return Response({
#             "id": soil_image.id,
#             "image_url": request.build_absolute_uri(
#                 soil_image.image.url
#             ),
#             "analysis": result
#         }, status=status.HTTP_201_CREATED)


# # ==========================================================
# # HEALTH SUMMARY
# # ==========================================================
# class SoilHealthSummaryView(APIView):

#     def get(self, request):
#         latest_test = SoilTest.objects.filter(
#             status='completed'
#         ).first()

#         if not latest_test:
#             return Response(
#                 {"message": "No soil tests available."},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         health_score = self._calculate_health_score(
#             latest_test
#         )

#         summary = {
#             "overall_health":
#                 self._get_health_label(health_score),

#             "health_score":
#                 health_score,

#             "nutrient_status": {
#                 "nitrogen":
#                     self._get_nutrient_status(
#                         latest_test.nitrogen,
#                         "nitrogen"
#                     ),

#                 "phosphorus":
#                     self._get_nutrient_status(
#                         latest_test.phosphorus,
#                         "phosphorus"
#                     ),

#                 "potassium":
#                     self._get_nutrient_status(
#                         latest_test.potassium,
#                         "potassium"
#                     ),

#                 "ph":
#                     self._get_ph_status(
#                         latest_test.ph
#                     ),
#             },

#             "recommendations_count":
#                 latest_test.recommendations.count(),

#             "last_test_date":
#                 latest_test.test_date
#         }

#         return Response(summary)

#     def _calculate_health_score(self, test):
#         score = 100

#         if test.nitrogen < 140:
#             score -= 15
#         elif test.nitrogen > 560:
#             score -= 10

#         if test.phosphorus < 10:
#             score -= 15
#         elif test.phosphorus > 50:
#             score -= 10

#         if test.potassium < 110:
#             score -= 15
#         elif test.potassium > 560:
#             score -= 10

#         if test.ph < 5.5 or test.ph > 8.5:
#             score -= 20
#         elif test.ph < 6.0 or test.ph > 7.5:
#             score -= 10

#         return max(0, min(100, score))

#     def _get_health_label(self, score):
#         if score >= 80:
#             return "Excellent"
#         elif score >= 60:
#             return "Good"
#         elif score >= 40:
#             return "Fair"
#         return "Poor"

#     def _get_nutrient_status(self, value, nutrient):
#         ranges = {
#             "nitrogen": {"low": 140, "high": 560},
#             "phosphorus": {"low": 10, "high": 50},
#             "potassium": {"low": 110, "high": 560},
#         }

#         r = ranges[nutrient]

#         if value < r["low"]:
#             return "Low"
#         elif value > r["high"]:
#             return "High"
#         return "Optimal"

#     def _get_ph_status(self, ph):
#         if ph < 5.5:
#             return "Very Acidic"
#         elif ph < 6.0:
#             return "Acidic"
#         elif ph <= 7.5:
#             return "Optimal"
#         elif ph <= 8.5:
#             return "Alkaline"
#         return "Very Alkaline"

# from rest_framework import generics, status, viewsets
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser
# from django.utils import timezone

# from .models import SoilTest, SoilRecommendation, SoilImage
# from .serializers import (
#     SoilTestSerializer,
#     SoilTestCreateSerializer,
#     SoilRecommendationSerializer,
#     SoilImageSerializer,
#     SoilImageUploadSerializer,
#     SoilImageAnalysisResultSerializer
# )
# from .services import SoilAnalysisService, SoilImageAnalyzer


# # ==========================================================
# # SOIL TEST CRUD
# # ==========================================================
# class SoilTestViewSet(viewsets.ModelViewSet):
#     queryset = SoilTest.objects.all().order_by('-created_at')

#     def get_serializer_class(self):
#         if self.action in ['create', 'update', 'partial_update']:
#             return SoilTestCreateSerializer
#         return SoilTestSerializer

#     def perform_create(self, serializer):
#         # force completed so dashboard updates instantly
#         soil_test = serializer.save(status="completed")

#         service = SoilAnalysisService()
#         recommendations = service.analyze_soil_test(soil_test)

#         for rec in recommendations:
#             SoilRecommendation.objects.create(
#                 soil_test=soil_test,
#                 **rec
#             )


# # ==========================================================
# # CURRENT SOIL ANALYSIS
# # ==========================================================
# class CurrentSoilAnalysisView(APIView):

#     def get(self, request):
#         soil_test = SoilTest.objects.filter(
#             status='completed'
#         ).first()

#         if not soil_test:
#             return Response(
#                 {"message": "No completed soil tests found."},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         serializer = SoilTestSerializer(soil_test)
#         return Response(serializer.data)


# # ==========================================================
# # SOIL HISTORY
# # ==========================================================
# class SoilHistoryView(generics.ListAPIView):
#     serializer_class = SoilTestSerializer

#     def get_queryset(self):
#         return SoilTest.objects.all().order_by('-created_at')


# # ==========================================================
# # SOIL RECOMMENDATIONS
# # ==========================================================
# class SoilRecommendationsView(generics.ListAPIView):
#     serializer_class = SoilRecommendationSerializer

#     def get_queryset(self):
#         return SoilRecommendation.objects.all().order_by(
#             '-priority',
#             '-created_at'
#         )[:20]


# # ==========================================================
# # IMAGE ANALYSIS
# # ==========================================================
# class SoilImageUploadView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request):
#         serializer = SoilImageUploadSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         soil_image = SoilImage.objects.create(
#             **serializer.validated_data
#         )

#         analyzer = SoilImageAnalyzer()
#         result = analyzer.analyze_image(
#             soil_image.image.path
#         )

#         soil_image.analyzed = True
#         soil_image.predicted_soil_type = result['soil_type']
#         soil_image.predicted_moisture = result['moisture']
#         soil_image.predicted_fertility = result['fertility']
#         soil_image.confidence = result['confidence']
#         soil_image.analysis_data = result['analysis_data']
#         soil_image.analyzed_at = timezone.now()
#         soil_image.save()

#         return Response({
#             "id": soil_image.id,
#             "image_url": request.build_absolute_uri(
#                 soil_image.image.url
#             ),
#             "analysis": result
#         }, status=status.HTTP_201_CREATED)


# # ==========================================================
# # HEALTH SUMMARY
# # ==========================================================
# class SoilHealthSummaryView(APIView):

#     def get(self, request):
#         latest_test = SoilTest.objects.filter(
#             status='completed'
#         ).first()

#         if not latest_test:
#             return Response(
#                 {"message": "No soil tests available."},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         health_score = self._calculate_health_score(
#             latest_test
#         )

#         summary = {
#             "overall_health":
#                 self._get_health_label(health_score),

#             "health_score":
#                 health_score,

#             "nutrient_status": {
#                 "nitrogen":
#                     self._get_nutrient_status(
#                         latest_test.nitrogen,
#                         "nitrogen"
#                     ),

#                 "phosphorus":
#                     self._get_nutrient_status(
#                         latest_test.phosphorus,
#                         "phosphorus"
#                     ),

#                 "potassium":
#                     self._get_nutrient_status(
#                         latest_test.potassium,
#                         "potassium"
#                     ),

#                 "ph":
#                     self._get_ph_status(
#                         latest_test.ph
#                     ),
#             },

#             "recommendations_count":
#                 latest_test.recommendations.count(),

#             "last_test_date":
#                 latest_test.test_date
#         }

#         return Response(summary)

#     def _calculate_health_score(self, test):
#         score = 100

#         if test.nitrogen < 140:
#             score -= 15
#         elif test.nitrogen > 560:
#             score -= 10

#         if test.phosphorus < 10:
#             score -= 15
#         elif test.phosphorus > 50:
#             score -= 10

#         if test.potassium < 110:
#             score -= 15
#         elif test.potassium > 560:
#             score -= 10

#         if test.ph < 5.5 or test.ph > 8.5:
#             score -= 20
#         elif test.ph < 6.0 or test.ph > 7.5:
#             score -= 10

#         return max(0, min(100, score))

#     def _get_health_label(self, score):
#         if score >= 80:
#             return "Excellent"
#         elif score >= 60:
#             return "Good"
#         elif score >= 40:
#             return "Fair"
#         return "Poor"

#     def _get_nutrient_status(self, value, nutrient):
#         ranges = {
#             "nitrogen": {"low": 140, "high": 560},
#             "phosphorus": {"low": 10, "high": 50},
#             "potassium": {"low": 110, "high": 560},
#         }

#         r = ranges[nutrient]

#         if value < r["low"]:
#             return "Low"
#         elif value > r["high"]:
#             return "High"
#         return "Optimal"

#     def _get_ph_status(self, ph):
#         if ph < 5.5:
#             return "Very Acidic"
#         elif ph < 6.0:
#             return "Acidic"
#         elif ph <= 7.5:
#             return "Optimal"
#         elif ph <= 8.5:
#             return "Alkaline"
#         return "Very Alkaline"


from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone

from .models import SoilTest, SoilRecommendation, SoilImage
from .serializers import (
    SoilTestSerializer,
    SoilTestCreateSerializer,
    SoilRecommendationSerializer,
    SoilImageUploadSerializer
)
from .services import SoilAnalysisService, SoilImageAnalyzer


# ==========================================================
# SOIL TEST CRUD
# ==========================================================
class SoilTestViewSet(viewsets.ModelViewSet):
    serializer_class = SoilTestSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return SoilTest.objects.filter(
                user=self.request.user
            ).order_by("-created_at")

        return SoilTest.objects.all().order_by("-created_at")

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SoilTestCreateSerializer
        return SoilTestSerializer

    def perform_create(self, serializer):
        # if logged in -> save user
        if self.request.user.is_authenticated:
            soil_test = serializer.save(
                user=self.request.user,
                status="completed"
            )
        else:
            soil_test = serializer.save(
                status="completed"
            )

        service = SoilAnalysisService()
        recommendations = service.analyze_soil_test(soil_test)

        for rec in recommendations:
            SoilRecommendation.objects.create(
                soil_test=soil_test,
                **rec
            )


# ==========================================================
# CURRENT SOIL ANALYSIS
# ==========================================================
class CurrentSoilAnalysisView(APIView):

    def get(self, request):

        if request.user.is_authenticated:
            soil_test = SoilTest.objects.filter(
                user=request.user,
                status="completed"
            ).order_by("-created_at").first()
        else:
            soil_test = SoilTest.objects.filter(
                status="completed"
            ).order_by("-created_at").first()

        if not soil_test:
            return Response(
                {"message": "No completed soil tests found"},
                status=404
            )

        serializer = SoilTestSerializer(soil_test)
        return Response(serializer.data)


# ==========================================================
# SOIL HISTORY
# ==========================================================
class SoilHistoryView(generics.ListAPIView):
    serializer_class = SoilTestSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return SoilTest.objects.filter(
                user=self.request.user
            ).order_by("-created_at")

        return SoilTest.objects.all().order_by("-created_at")


# # ==========================================================
# # RECOMMENDATIONS
# # ==========================================================
# class SoilRecommendationsView(generics.ListAPIView):
#     serializer_class = SoilRecommendationSerializer

#     def get_queryset(self):
#         if self.request.user.is_authenticated:
#             return SoilRecommendation.objects.filter(
#                 soil_test__user=self.request.user
#             ).order_by("-priority", "-created_at")

#         return SoilRecommendation.objects.all().order_by(
#             "-priority",
#             "-created_at"
#         )
class SoilRecommendationsView(generics.ListAPIView):
    serializer_class = SoilRecommendationSerializer

    def list(self, request, *args, **kwargs):

        if request.user.is_authenticated:
            recommendations = SoilRecommendation.objects.filter(
                soil_test__user=request.user
            ).order_by("-priority", "-created_at")
        else:
            recommendations = SoilRecommendation.objects.all().order_by(
                "-priority",
                "-created_at"
            )

        data = []

        for r in recommendations:

            # ---------------- CROP PARSE ----------------
            crop_name = None
            soil_reason = None

            if r.category == "crop":
                crop_name = "Recommended Crop Selection"
                soil_reason = r.description

            # ---------------- NUTRIENT INSIGHT ----------------
            nutrient_notes = None
            if r.category == "fertilizer":
                nutrient_notes = r.description

            # ---------------- CLIMATE / PH INSIGHT ----------------
            climate_notes = None
            if r.category == "amendment":
                climate_notes = r.description

            data.append({
                "id": r.id,
                "title": r.title,
                "desc": r.description,
                "action": r.action_required,
                "severity": r.priority,

                # NEW FRONTEND FIELDS
                "crop_name": crop_name,
                "soil_reason": soil_reason,
                "nutrient_notes": nutrient_notes,
                "climate_notes": climate_notes,
            })

        return Response(data)

# ==========================================================
# IMAGE ANALYSIS
# ==========================================================
class SoilImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = SoilImageUploadSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        if request.user.is_authenticated:
            soil_image = SoilImage.objects.create(
                user=request.user,
                **serializer.validated_data
            )
        else:
            soil_image = SoilImage.objects.create(
                **serializer.validated_data
            )

        analyzer = SoilImageAnalyzer()

        result = analyzer.analyze_image(
            soil_image.image.path
        )

        soil_image.analyzed = True
        soil_image.predicted_soil_type = result["soil_type"]
        soil_image.predicted_moisture = result["moisture"]
        soil_image.predicted_fertility = result["fertility"]
        soil_image.confidence = result["confidence"]
        soil_image.analysis_data = result["analysis_data"]
        soil_image.analyzed_at = timezone.now()
        soil_image.save()

        return Response({
            "id": soil_image.id,
            "image_url": request.build_absolute_uri(
                soil_image.image.url
            ),
            "analysis": result
        }, status=201)


# ==========================================================
# HEALTH SUMMARY
# ==========================================================
class SoilHealthSummaryView(APIView):

    def get(self, request):

        if request.user.is_authenticated:
            latest_test = SoilTest.objects.filter(
                user=request.user,
                status="completed"
            ).order_by("-created_at").first()
        else:
            latest_test = SoilTest.objects.filter(
                status="completed"
            ).order_by("-created_at").first()

        if not latest_test:
            return Response({
                "overall_health": "No Data",
                "health_score": 0,
                "nutrient_status": {}
            })

        score = self._calculate_health_score(latest_test)

        return Response({
            "overall_health": self._get_health_label(score),
            "health_score": score,
            "nutrient_status": {
                "nitrogen": self._get_nutrient_status(
                    latest_test.nitrogen, "nitrogen"
                ),
                "phosphorus": self._get_nutrient_status(
                    latest_test.phosphorus, "phosphorus"
                ),
                "potassium": self._get_nutrient_status(
                    latest_test.potassium, "potassium"
                ),
                "ph": self._get_ph_status(
                    latest_test.ph
                )
            },
            "recommendations_count":
                latest_test.recommendations.count(),
            "last_test_date":
                latest_test.test_date
        })

    def _calculate_health_score(self, test):
        score = 100

        if test.nitrogen < 140:
            score -= 15
        elif test.nitrogen > 560:
            score -= 10

        if test.phosphorus < 10:
            score -= 15
        elif test.phosphorus > 50:
            score -= 10

        if test.potassium < 110:
            score -= 15
        elif test.potassium > 560:
            score -= 10

        if test.ph < 5.5 or test.ph > 8.5:
            score -= 20
        elif test.ph < 6.0 or test.ph > 7.5:
            score -= 10

        return max(0, min(100, score))

    def _get_health_label(self, score):
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Fair"
        return "Poor"

    def _get_nutrient_status(self, value, nutrient):
        ranges = {
            "nitrogen": {"low": 140, "high": 560},
            "phosphorus": {"low": 10, "high": 50},
            "potassium": {"low": 110, "high": 560},
        }

        r = ranges[nutrient]

        if value < r["low"]:
            return "Low"
        elif value > r["high"]:
            return "High"
        return "Optimal"

    def _get_ph_status(self, ph):
        if ph < 5.5:
            return "Very Acidic"
        elif ph < 6.0:
            return "Acidic"
        elif ph <= 7.5:
            return "Optimal"
        elif ph <= 8.5:
            return "Alkaline"
        return "Very Alkaline"