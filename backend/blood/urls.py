from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BloodRequestViewSet, BloodInventoryViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'requests', BloodRequestViewSet, basename='bloodrequest')
router.register(r'inventory', BloodInventoryViewSet, basename='bloodinventory')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]