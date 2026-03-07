from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BloodRequestViewSet, BloodInventoryViewSet, DashboardAnalyticsView, SystemAuditLogsView

router = DefaultRouter()
router.register(r'requests', BloodRequestViewSet, basename='blood-request')
router.register(r'inventory', BloodInventoryViewSet, basename='blood-inventory')

urlpatterns = [
    path('analytics/', DashboardAnalyticsView.as_view(), name='dashboard-analytics'),
    path('audit/', SystemAuditLogsView.as_view(), name='system-audit'),
    path('', include(router.urls)),
]