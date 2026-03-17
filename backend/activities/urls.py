from django.urls import path
from .views import ActivityListCreateView, ActivityDetailView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("activities/", ActivityListCreateView.as_view(), name="activity-list-create"),
    path("activities/<int:pk>/", ActivityDetailView.as_view(), name="activity-detail"),
]
