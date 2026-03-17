from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Activity


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
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
