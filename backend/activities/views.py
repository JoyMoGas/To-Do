from rest_framework import generics
from .models import Activity
from .serializers import ActivitySerializer
from django.contrib.auth.models import User


def get_default_user():
    user = User.objects.first()
    if not user:
        user = User.objects.create_user(username="defaultuser", password="password")
    return user


class ActivityListCreateView(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer

    def get_queryset(self):
        return Activity.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=get_default_user())


class ActivityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ActivitySerializer

    def get_queryset(self):
        return Activity.objects.all()
