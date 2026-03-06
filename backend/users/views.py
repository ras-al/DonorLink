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
    permission_classes = [IsAuthenticated] # Must provide a valid JWT Token

    def get(self, request):
        # request.user is automatically set by the JWT authentication token!
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)