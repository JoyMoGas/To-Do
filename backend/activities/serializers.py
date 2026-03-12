from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Activity
        fields = ["id", "title", "description", "completed", "created_at", "owner"]
        read_only_fields = ["owner"]

    def create(self, validated_data):
        # We assign owner based on the request user
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["owner"] = request.user
        return super().create(validated_data)
