from rest_framework import serializers
from .models import SoilTest, SoilRecommendation, SoilImage


class SoilTestSerializer(serializers.ModelSerializer):
    recommendations = serializers.SerializerMethodField()
    
    class Meta:
        model = SoilTest
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_recommendations(self, obj):
        return SoilRecommendationSerializer(obj.recommendations.all(), many=True).data


class SoilTestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilTest
        exclude = ['user']
        read_only_fields = ['created_at', 'updated_at']


class SoilRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilRecommendation
        fields = '__all__'
        read_only_fields = ['created_at']


class SoilImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilImage
        fields = '__all__'
        read_only_fields = ['user', 'analyzed', 'predicted_soil_type', 
                          'predicted_moisture', 'predicted_fertility',
                          'confidence', 'analysis_data', 'uploaded_at', 'analyzed_at']


class SoilImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilImage
        fields = ['image', 'field_name', 'soil_test']


class SoilImageAnalysisResultSerializer(serializers.Serializer):
    soil_type = serializers.CharField()
    moisture = serializers.CharField()
    fertility = serializers.CharField()
    confidence = serializers.FloatField()
    analysis_data = serializers.DictField()
    analyzed_at = serializers.CharField()


class SoilHealthSummarySerializer(serializers.Serializer):
    overall_health = serializers.CharField()
    health_score = serializers.IntegerField()
    nutrient_status = serializers.DictField()
    recommendations_count = serializers.IntegerField()
    last_test_date = serializers.DateField()
