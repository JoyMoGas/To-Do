from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "title", "description", "completed", "created_at", "user"]
        read_only_fields = ["user"]
