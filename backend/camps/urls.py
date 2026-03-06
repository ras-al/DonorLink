from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DonationCampViewSet

router = DefaultRouter()
router.register(r'list', DonationCampViewSet, basename='donationcamp')

urlpatterns = [
    path('', include(router.urls)),
]