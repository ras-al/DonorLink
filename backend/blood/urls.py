from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BloodRequestViewSet, BloodInventoryViewSet, DashboardAnalyticsView

router = DefaultRouter()
router.register(r'requests', BloodRequestViewSet, basename='bloodrequest')
router.register(r'inventory', BloodInventoryViewSet, basename='bloodinventory')

urlpatterns = [
    path('analytics/', DashboardAnalyticsView.as_view(), name='dashboard-analytics'),
    path('', include(router.urls)),
]