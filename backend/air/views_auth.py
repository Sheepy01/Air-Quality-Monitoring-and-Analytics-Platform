from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers_auth import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User registered successfully"
        })

    return Response(serializer.errors, status=400)

class LoginView(TokenObtainPairView):
    pass

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):

    serializer = UserSerializer(request.user)

    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):

    return Response({"message": "Logged out successfully"})