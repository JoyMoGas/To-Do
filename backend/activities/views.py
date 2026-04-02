from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Activity, TaskList, TaskSection
from .serializers import ActivitySerializer, UserSerializer, TaskListSerializer, TaskSectionSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

class TaskListListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TaskList.objects.filter(Q(owner=user) | Q(shared_with=user)).distinct()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TaskListDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TaskList.objects.filter(Q(owner=user) | Q(shared_with=user)).distinct()

class ActivityListCreateView(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        task_list_id = self.request.query_params.get('task_list')
        
        # Base filter: user owns activity, or activity is in a list owned/shared with user
        queryset = Activity.objects.filter(
            Q(owner=user) | 
            Q(task_list__owner=user) | 
            Q(task_list__shared_with=user)
        ).distinct()

        if task_list_id:
            queryset = queryset.filter(task_list_id=task_list_id)
            
        return queryset

class TaskSectionListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        task_list_id = self.request.query_params.get('task_list')
        queryset = TaskSection.objects.filter(
            Q(task_list__owner=user) | Q(task_list__shared_with=user)
        ).distinct()
        if task_list_id:
            queryset = queryset.filter(task_list_id=task_list_id)
        return queryset

class TaskSectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TaskSection.objects.filter(
            Q(task_list__owner=user) | Q(task_list__shared_with=user)
        ).distinct()

class ActivityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Activity.objects.filter(
            Q(owner=user) | 
            Q(task_list__owner=user) | 
            Q(task_list__shared_with=user)
        ).distinct()
