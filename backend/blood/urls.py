from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BloodRequestViewSet, BloodInventoryViewSet, DashboardAnalyticsView, SystemAuditLogsView, PublicStatsView

router = DefaultRouter()
router.register(r'requests', BloodRequestViewSet, basename='blood-request')
router.register(r'inventory', BloodInventoryViewSet, basename='blood-inventory')

urlpatterns = [
    path('analytics/', DashboardAnalyticsView.as_view(), name='dashboard-analytics'),
    path('public-stats/', PublicStatsView.as_view(), name='public-stats'),
    path('audit/', SystemAuditLogsView.as_view(), name='system-audit'),
    path('', include(router.urls)),
]