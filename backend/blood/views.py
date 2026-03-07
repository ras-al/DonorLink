from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import BloodRequest, BloodInventory, DonationLog
from .serializers import BloodRequestSerializer, BloodInventorySerializer
from camps.models import DonationCamp
from users.models import DonorProfile, Penalty, Blacklist, User
from rest_framework.views import APIView

class DashboardAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {}
        
        if user.role == 'hospital':
            data['total_requests'] = BloodRequest.objects.filter(hospital=user).count()
            data['fulfilled_requests'] = BloodRequest.objects.filter(hospital=user, status='fulfilled').count()
            data['critical_requests'] = BloodRequest.objects.filter(hospital=user, urgency_level='critical').count()
            data['active_donors'] = DonorProfile.objects.filter(is_available=True).count()
            
        elif user.role == 'organization':
            camps = DonationCamp.objects.filter(organization=user)
            data['total_camps'] = camps.count()
            data['active_camps'] = camps.filter(status='active').count()
            data['expected_turnout'] = sum([c.expected_donors for c in camps])
            
        elif user.role == 'admin':
            data['total_users'] = User.objects.count()
            data['total_requests'] = BloodRequest.objects.count()
            data['active_penalties'] = Penalty.objects.count()
            data['blacklisted_users'] = Blacklist.objects.count()
            
        return Response(data, status=status.HTTP_200_OK)

class BloodRequestViewSet(viewsets.ModelViewSet):
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'hospital':
            return BloodRequest.objects.filter(hospital=user).order_by('-created_at')
        
        if user.role == 'donor':
            return BloodRequest.objects.filter(status__in=['pending', 'matching']).order_by('-created_at')
            
        return BloodRequest.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(hospital=self.request.user)

    # NEW: Custom endpoint for Donors to accept a request
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        blood_request = self.get_object()
        user = request.user

        # Security Checks
        if user.role != 'donor':
            return Response({'detail': 'Only donors can accept requests.'}, status=status.HTTP_403_FORBIDDEN)
        
        if blood_request.status == 'fulfilled':
            return Response({'detail': 'This request has already been fulfilled.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Update the Request Status
        blood_request.status = 'fulfilled'
        blood_request.save()

        # 2. Create the Donation Log
        DonationLog.objects.create(
            donor=user,
            blood_request=blood_request,
            status='completed',
            trust_points_awarded=10 # Award 10 points for a successful donation!
        )

        return Response({'detail': 'Request accepted successfully!'}, status=status.HTTP_200_OK)

class BloodInventoryViewSet(viewsets.ModelViewSet):
    serializer_class = BloodInventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'hospital':
            return BloodInventory.objects.filter(hospital=self.request.user).order_by('blood_group')
        return BloodInventory.objects.none()

    def perform_create(self, serializer):
        serializer.save(hospital=self.request.user)

class SystemAuditLogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
            
        from .models import AIAuditLog
        from users.models import Penalty, Blacklist
        
        ai_logs = AIAuditLog.objects.order_by('-timestamp')[:50]
        penalties = Penalty.objects.select_related('user').order_by('-created_at')[:50]
        blacklists = Blacklist.objects.select_related('user').order_by('-blacklisted_on')[:50]
        
        feed = []
        for log in ai_logs:
            feed.append({
                'id': f"ai-{log.id}",
                'type': 'ai_audit',
                'title': f"AI Matching for Request #{log.blood_request.id}",
                'description': log.ai_decision_data.get('summary', 'AI matching completed.'),
                'timestamp': log.timestamp,
                'color': 'brand'
            })
            
        for p in penalties:
            feed.append({
                'id': f"penalty-{p.id}",
                'type': 'penalty',
                'title': f"Penalty: {p.user.email}",
                'description': f"-{p.points_deducted} pts: {p.reason}",
                'timestamp': p.created_at,
                'color': 'yellow'
            })
            
        for b in blacklists:
            feed.append({
                'id': f"ban-{b.id}",
                'type': 'blacklist',
                'title': f"User Banned: {b.user.email}",
                'description': b.reason,
                'timestamp': b.blacklisted_on,
                'color': 'red'
            })
            
        # Sort feed descending
        feed.sort(key=lambda x: x['timestamp'], reverse=True)
        return Response(feed, status=status.HTTP_200_OK)