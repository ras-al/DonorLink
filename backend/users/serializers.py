from rest_framework import serializers
from .models import User, DonorProfile, InstitutionalProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'phone', 'address']

class RegisterSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    
    # Donor Specific Fields
    blood_group = serializers.CharField(max_length=3, required=False)
    date_of_birth = serializers.DateField(required=False)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    gender = serializers.CharField(max_length=10, required=False)
    last_donation_date = serializers.DateField(required=False, allow_null=True)
    disease_conditions = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    # Institution Specific Fields
    organization_name = serializers.CharField(max_length=200, required=False)
    registration_id = serializers.CharField(max_length=100, required=False)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        role = validated_data.get('role')
        email = validated_data.get('email')
        
        # 1. Create the base User
        user = User.objects.create_user(
            username=email, # We use email as the username
            email=email,
            password=validated_data.get('password'),
            role=role,
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', '')
        )

        # 2. Create the linked Profile based on role
        if role == 'donor':
            last_date = validated_data.get('last_donation_date')
            is_avail = True
            
            if last_date:
                from datetime import date
                if (date.today() - last_date).days < 90:
                    is_avail = False
            
            DonorProfile.objects.create(
                user=user,
                blood_group=validated_data.get('blood_group'),
                date_of_birth=validated_data.get('date_of_birth'),
                weight=validated_data.get('weight'),
                gender=validated_data.get('gender', 'other'),
                last_donation_date=last_date,
                disease_conditions=validated_data.get('disease_conditions', ''),
                is_available=is_avail
            )
        elif role in ['hospital', 'organization']:
            InstitutionalProfile.objects.create(
                user=user,
                registration_id=validated_data.get('registration_id'),
                organization_name=validated_data.get('organization_name', '')
            )
        
        return user