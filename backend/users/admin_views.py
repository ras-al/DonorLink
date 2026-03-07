from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, Penalty, Blacklist
from .admin_serializers import AdminUserManagementSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserManagementSerializer
    permission_classes = [IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if hasattr(request.user, 'role') and request.user.role != 'admin':
            self.permission_denied(request, message='Only admins are allowed.')

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.role == 'admin':
            return Response(
                {'detail': 'Admin accounts cannot be deleted.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def penalize(self, request, pk=None):
        user = self.get_object()
        reason = request.data.get('reason', 'Violation of terms')
        points = int(request.data.get('points', 10))
        
        Penalty.objects.create(user=user, reason=reason, points_deducted=points)
        
        # Deduct from donor profile if applicable
        if user.role == 'donor' and hasattr(user, 'donor_profile'):
            user.donor_profile.trust_score = max(0, user.donor_profile.trust_score - points)
            user.donor_profile.save()
            
        return Response({'status': 'Penalty applied.'})

    @action(detail=True, methods=['post'])
    def blacklist(self, request, pk=None):
        user = self.get_object()
        reason = request.data.get('reason', 'Admin ban')
        
        if not hasattr(user, 'blacklist_record'):
            Blacklist.objects.create(user=user, reason=reason)
        
        user.is_active = False
        user.save()
        return Response({'status': 'User blacklisted.'})

    @action(detail=True, methods=['post'])
    def reactivate(self, request, pk=None):
        user = self.get_object()
        if hasattr(user, 'blacklist_record'):
            user.blacklist_record.delete()
        
        user.is_active = True
        user.save()
        return Response({'status': 'User reactivated.'})
