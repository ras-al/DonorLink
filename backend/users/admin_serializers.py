from rest_framework import serializers
from .models import User, DonorProfile, InstitutionalProfile, Penalty, Blacklist

class AdminUserManagementSerializer(serializers.ModelSerializer):
    trust_score = serializers.SerializerMethodField()
    is_blacklisted = serializers.SerializerMethodField()
    profile_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'phone', 'is_active', 'date_joined', 'trust_score', 'is_blacklisted', 'profile_name']

    def get_trust_score(self, obj):
        if obj.role == 'donor' and hasattr(obj, 'donor_profile'):
            return obj.donor_profile.trust_score
        return None

    def get_is_blacklisted(self, obj):
        return hasattr(obj, 'blacklist_record')

    def get_profile_name(self, obj):
        if obj.role == 'donor':
            return f"{obj.first_name} {obj.last_name}".strip()
        elif obj.role in ['hospital', 'organization'] and hasattr(obj, 'institutional_profile'):
            return obj.institutional_profile.organization_name
        return obj.email.split('@')[0]
