from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DonationCamp, CampRegistration
from .serializers import DonationCampSerializer, CampRegistrationSerializer

class DonationCampViewSet(viewsets.ModelViewSet):
    serializer_class = DonationCampSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Organizations only see their own camps
        if user.role == 'organization':
            return DonationCamp.objects.filter(organization=user).order_by('-date')
        
        # Donors/Hospitals see all active and upcoming camps
        return DonationCamp.objects.filter(status__in=['upcoming', 'active']).order_by('date')

    def perform_create(self, serializer):
        # We will hardcode the AI prediction to 50 for now until we build the AI module!
        serializer.save(organization=self.request.user, expected_donors=50)