from rest_framework import serializers
from .models import *


class PlantingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantingRecord
        fields = "__all__"
        read_only_fields = ["user"]


class HarvestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HarvestRecord
        fields = "__all__"
        read_only_fields = ["user"]


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleRecord
        fields = "__all__"
        read_only_fields = ["user"]


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseRecord
        fields = "__all__"
        read_only_fields = ["user"]


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceUsage
        fields = "__all__"
        read_only_fields = ["user"]