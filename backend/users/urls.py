from django.urls import path
from .views import ProfileView, UserSearchView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile-detail'),
    path('search/', UserSearchView.as_view(), name='user-search'),
]
