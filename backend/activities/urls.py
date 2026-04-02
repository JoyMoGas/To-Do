from django.urls import path
from .views import ActivityListCreateView, ActivityDetailView, RegisterView, TaskListListCreateView, TaskListDetailView, TaskSectionListCreateView, TaskSectionDetailView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("task-lists/", TaskListListCreateView.as_view(), name="task-list-create"),
    path("task-lists/<int:pk>/", TaskListDetailView.as_view(), name="task-list-detail"),
    path("sections/", TaskSectionListCreateView.as_view(), name="section-list-create"),
    path("sections/<int:pk>/", TaskSectionDetailView.as_view(), name="section-detail"),
    path("activities/", ActivityListCreateView.as_view(), name="activity-list-create"),
    path("activities/<int:pk>/", ActivityDetailView.as_view(), name="activity-detail"),
]
