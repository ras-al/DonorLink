from rest_framework import serializers
from .models import BloodRequest, DonationLog

class BloodRequestSerializer(serializers.ModelSerializer):
    # We want to display the hospital's name, not just their ID
    hospital_name = serializers.SerializerMethodField()

    class Meta:
        model = BloodRequest
        fields = ['id', 'hospital', 'hospital_name', 'patient_name', 'blood_group', 
                  'urgency_level', 'location', 'required_date', 'status', 'created_at']
        read_only_fields = ['id', 'hospital', 'status', 'created_at']

    def get_hospital_name(self, obj):
        # Safely attempt to get the organization name if it exists
        if hasattr(obj.hospital, 'institutional_profile'):
             return obj.hospital.institutional_profile.organization_name
        return obj.hospital.username

class DonationLogSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.username', read_only=True)
    request_details = BloodRequestSerializer(source='blood_request', read_only=True)

    class Meta:
        model = DonationLog
        fields = ['id', 'donor', 'donor_name', 'blood_request', 'request_details', 'status', 'trust_points_awarded', 'date']
        read_only_fields = ['id', 'donor', 'trust_points_awarded', 'date']

from .models import BloodInventory

class BloodInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodInventory
        fields = ['id', 'hospital', 'blood_group', 'units_available', 'last_updated']
        read_only_fields = ['id', 'hospital', 'last_updated']