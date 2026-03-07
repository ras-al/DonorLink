from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny] # Anyone can register

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Account created successfully!'}, status=status.HTTP_201_CREATED)
        
        # If data is invalid (e.g., missing email, duplicate user), return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        
        # Determine Name
        name = f"{request.user.first_name} {request.user.last_name}".strip()
        
        # Inject Donor-specific data if the user is a donor
        if request.user.role == 'donor' and hasattr(request.user, 'donor_profile'):
            from blood.models import DonationLog
            data['is_available'] = request.user.donor_profile.is_available
            data['blood_group'] = request.user.donor_profile.blood_group
            data['trust_score'] = request.user.donor_profile.trust_score
            data['donations_count'] = DonationLog.objects.filter(donor=request.user, status='completed').count()
            data['last_donation_date'] = request.user.donor_profile.last_donation_date
            data['disease_conditions'] = request.user.donor_profile.disease_conditions
        elif request.user.role in ['hospital', 'organization'] and hasattr(request.user, 'institutional_profile'):
            if request.user.institutional_profile.organization_name:
                name = request.user.institutional_profile.organization_name
                
        data['name'] = name
            
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        data = request.data
        
        # 1. Update Base User Fields
        if 'phone' in data: user.phone = data['phone']
        if 'address' in data: user.address = data['address']
        user.save()

        # 2. Update Donor Specific Fields
        if user.role == 'donor' and hasattr(user, 'donor_profile'):
            profile = user.donor_profile
            # Toggle availability status
            if 'is_available' in data: 
                profile.is_available = data['is_available']
            if 'last_donation_date' in data:
                val = data['last_donation_date']
                profile.last_donation_date = val if val else None
                
                # Check 3 month gap
                if profile.last_donation_date:
                    from datetime import date, datetime
                    if isinstance(profile.last_donation_date, str):
                        ld = datetime.strptime(profile.last_donation_date, "%Y-%m-%d").date()
                    else:
                        ld = profile.last_donation_date
                    
                    if (date.today() - ld).days < 90:
                        profile.is_available = False
                    else:
                        profile.is_available = True
                        
            if 'disease_conditions' in data:
                profile.disease_conditions = data['disease_conditions']
            profile.save()
        
        return Response({'message': 'Profile updated successfully!'}, status=status.HTTP_200_OK)

class DonorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from .models import User
        donors = User.objects.filter(role='donor', donor_profile__is_available=True)
        
        bg = request.query_params.get('blood_group')
        if bg and bg != 'All' and bg != 'Emergency':
            donors = donors.filter(donor_profile__blood_group=bg)
            
        # Optional: search by location/email
        search = request.query_params.get('search')
        if search:
            donors = donors.filter(address__icontains=search) | donors.filter(email__icontains=search)
            
        data = []
        for d in donors.select_related('donor_profile')[:50]: # Limit to 50 for performance
            profile = d.donor_profile
            # Provide public data needed for UI
            data.append({
                'id': str(d.id),
                'name': (d.first_name + ' ' + d.last_name).strip() or d.email.split('@')[0].capitalize(),
                'blood_group': profile.blood_group,
                'dist': 'Nearby', # Placeholder for MVP
                'address': d.address or 'Location unknown',
                'phone': d.phone or 'No phone provided',
                'trust_score': profile.trust_score,
                'status': 'Active' if profile.is_available else 'Away'
            })
            
        return Response(data, status=status.HTTP_200_OK)