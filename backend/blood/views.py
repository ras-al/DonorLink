from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import BloodRequest, BloodInventory, DonationLog
from .serializers import BloodRequestSerializer, BloodInventorySerializer
from camps.models import DonationCamp
from users.models import DonorProfile, Penalty, Blacklist, User
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .ai_engine import DonorMatchEngine, TrustScoreEngine

class PublicStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            'total_donors': DonorProfile.objects.count(),
            'verified_hospitals': User.objects.filter(role='hospital').count(),
            'lives_saved': DonationLog.objects.filter(status='completed').count() * 3, # Usually 1 donation saves up to 3 lives
            'active_camps': DonationCamp.objects.filter(status='active').count(),
            'recent_requests': BloodRequest.objects.filter(status='pending').order_by('-created_at')[:3].values(
                'blood_group', 'hospital__institutional_profile__organization_name', 'hospital__address', 'urgency_level'
            )
        }
        
        # Format the requests nicely for the frontend
        formatted_requests = []
        for req in data['recent_requests']:
            formatted_requests.append({
                'bg': req['blood_group'],
                'loc': req['hospital__institutional_profile__organization_name'] or 'Hospital',
                'urgent': req['urgency_level'] == 'critical'
            })
            
        data['recent_requests_list'] = formatted_requests
        return Response(data, status=status.HTTP_200_OK)


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
        # 1. Save the new blood request
        blood_request = serializer.save(hospital=self.request.user)

        # 2. Trigger the AI Match Engine!
        best_matches = DonorMatchEngine.get_best_matches(
            blood_group=blood_request.blood_group,
            hospital_location=blood_request.location,
            urgency_level=blood_request.urgency_level
        )

        # 3. MVP Action: Log the AI's decisions to the console so we can see it working!
        print("\n" + "="*50)
        print(f"🚨 AI EMERGENCY PROTOCOL ACTIVATED 🚨")
        print(f"Hospital: {self.request.user.username}")
        print(f"Needed: {blood_request.blood_group} | Urgency: {blood_request.urgency_level}")
        print("-" * 50)
        if not best_matches:
            print("❌ AI WARNING: No eligible donors found in the network!")
        else:
            print(f"✅ AI Identified Top {len(best_matches)} Donors:")
            for rank, match in enumerate(best_matches, 1):
                donor_name = match['donor_profile'].user.username
                score = match['match_score']
                print(f"  {rank}. {donor_name} | AI Score: {score}")
        print("="*50 + "\n")
        
        # Note: In a full production app with a mobile app, this is exactly where you 
        # would trigger Push Notifications or SMS messages strictly to these `best_matches`!

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

    @action(detail=True, methods=['post'])
    def report_noshow(self, request, pk=None):
        blood_request = self.get_object()
        
        # Security: Only the hospital that created the request can report a no-show
        if request.user.role != 'hospital' or blood_request.hospital != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Find the specific donor who accepted this request
        log = DonationLog.objects.filter(blood_request=blood_request, status='completed').first()
        if not log:
            return Response({'detail': 'No donor log found for this request.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # 1. Trigger the AI Penalty Engine! (Deduct 20 points)
        donor_profile = log.donor.donor_profile
        new_score = TrustScoreEngine.penalize_donor(
            donor_profile=donor_profile, 
            reason=f"Failed to arrive for Critical Request #{blood_request.id}",
            points=20
        )

        # 2. Re-open the emergency request so the AI can match a new donor
        blood_request.status = 'pending'
        blood_request.save()
        
        # 3. Update the log to reflect the failure
        log.status = 'no_show'
        log.save()

        return Response({
            'detail': 'Donor penalized and added to audit log. Emergency request has been re-opened for new matches.'
        }, status=status.HTTP_200_OK)

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