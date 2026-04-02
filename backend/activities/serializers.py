from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Activity, TaskList, TaskSection

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class TaskSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSection
        fields = ['id', 'name', 'task_list', 'created_at']

class TaskListSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    shared_with_users = serializers.SerializerMethodField(read_only=True)
    sections = TaskSectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = TaskList
        fields = ['id', 'name', 'owner', 'owner_username', 'shared_with', 'shared_with_users', 'sections', 'created_at']
        read_only_fields = ['owner']
        extra_kwargs = {
            'shared_with': {'required': False}
        }

    def get_shared_with_users(self, obj):
        return [{'id': u.id, 'username': u.username} for u in obj.shared_with.all()]

class ActivitySerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Activity
        fields = ["id", "title", "description", "completed", "created_at", "owner", "owner_username", "task_list", "section"]
        read_only_fields = ["owner"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["owner"] = request.user
        return super().create(validated_data)
