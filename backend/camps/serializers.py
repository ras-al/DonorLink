from rest_framework import serializers
from .models import DonationCamp, CampRegistration

class DonationCampSerializer(serializers.ModelSerializer):
    # Safely get the organization's name
    organization_name = serializers.CharField(source='organization.institutional_profile.organization_name', read_only=True)

    class Meta:
        model = DonationCamp
        fields = ['id', 'organization', 'organization_name', 'name', 'date', 'location', 'expected_donors', 'status', 'created_at']
        read_only_fields = ['id', 'organization', 'expected_donors', 'created_at']

class CampRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampRegistration
        fields = '__all__'
        read_only_fields = ['donor', 'registered_at']