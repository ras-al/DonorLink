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
        
        # Inject Donor-specific data if the user is a donor
        if request.user.role == 'donor' and hasattr(request.user, 'donorprofile'):
            data['is_available'] = request.user.donorprofile.is_available
            data['blood_group'] = request.user.donorprofile.blood_group
            data['trust_score'] = request.user.donorprofile.trust_score
            
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        data = request.data
        
        # 1. Update Base User Fields
        if 'phone' in data: user.phone = data['phone']
        if 'address' in data: user.address = data['address']
        user.save()

        # 2. Update Donor Specific Fields
        if user.role == 'donor' and hasattr(user, 'donorprofile'):
            profile = user.donorprofile
            # Toggle availability status
            if 'is_available' in data: 
                profile.is_available = data['is_available']
            profile.save()
        
        return Response({'message': 'Profile updated successfully!'}, status=status.HTTP_200_OK)