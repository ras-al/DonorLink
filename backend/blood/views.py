from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BloodRequest
from .serializers import BloodRequestSerializer

class BloodRequestViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides default `create()`, `retrieve()`, `update()`,
    `partial_update()`, `destroy()` and `list()` actions.
    """
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # If the user is a hospital, only show their own requests
        if user.role == 'hospital':
            return BloodRequest.objects.filter(hospital=user).order_by('-created_at')
        
        # If the user is a donor, show all 'pending' or 'matching' requests
        if user.role == 'donor':
            return BloodRequest.objects.filter(status__in=['pending', 'matching']).order_by('-created_at')
            
        # Admin or Org can see all
        return BloodRequest.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically assign the request to the currently logged-in hospital
        if self.request.user.role != 'hospital':
             # Optionally throw an error if a donor tries to create a request
             pass 
             
        serializer.save(hospital=self.request.user)

from .models import BloodInventory
from .serializers import BloodInventorySerializer

class BloodInventoryViewSet(viewsets.ModelViewSet):
    serializer_class = BloodInventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # A hospital only sees its own inventory
        if self.request.user.role == 'hospital':
            return BloodInventory.objects.filter(hospital=self.request.user).order_by('blood_group')
        return BloodInventory.objects.none()

    def perform_create(self, serializer):
        serializer.save(hospital=self.request.user)