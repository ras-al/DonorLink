from django.urls import path
from .views import RegisterView, UserProfileView, DonorListView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Registration
    path('register/', RegisterView.as_view(), name='register'),
    
    # Get Current User Info
    path('me/', UserProfileView.as_view(), name='user_profile'),
    
    # List Donors
    path('donors/', DonorListView.as_view(), name='list_donors'),
    
    # JWT Login Endpoints
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]