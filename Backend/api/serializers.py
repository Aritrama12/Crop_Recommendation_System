from rest_framework import serializers
from .models import CropPrediction

# validate the input form
class CropPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropPrediction
        fields = "__all__"
        read_only_fields = ["predicted_crop", "created_at"]

    # 🔥 Custom validation messages
    def validate_N(self, value):
        if value < 0 or value > 150:
            raise serializers.ValidationError("Nitrogen must be between 0 and 150")
        return value

    def validate_P(self, value):
        if value < 0 or value > 150:
            raise serializers.ValidationError("Phosphorus must be between 0 and 150")
        return value

    def validate_K(self, value):
        if value < 0 or value > 210:
            raise serializers.ValidationError("Potassium must be between 0 and 210")
        return value

    def validate_temperature(self, value):
        if value < -10 or value > 60:
            raise serializers.ValidationError("Temperature must be between -10°C and 60°C")
        return value

    def validate_humidity(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Humidity must be between 0% and 100%")
        return value

    def validate_ph(self, value):
        if value < 0 or value > 14:
            raise serializers.ValidationError("pH must be between 0 and 14")
        return value

    def validate_rainfall(self, value):
        if value < 0 or value > 500:
            raise serializers.ValidationError("Rainfall must be between 0 and 500 mm")
        return value