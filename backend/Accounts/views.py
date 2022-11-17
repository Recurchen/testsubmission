from django.shortcuts import get_object_or_404, render

# Create your views here.
import rest_framework
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from .serializers import SignUpSerializer, RetrieveUpdateProfileSerializer
from .models import Profile
from django.contrib.auth.models import User
import jwt, datetime


class RegisterView(APIView):
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LogInView(APIView):
    permission_classes = []
    def post(self,request):
        username = request.data['username']
        password = request.data['password']

        user = authenticate(username=username, password=password)

        if user is None:
            raise AuthenticationFailed('Incorrent Username or Password')
        
        response = {"message": "Login Successfull", "tokens": user.auth_token.key}
        return Response(data=response)

from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


# class ProfileAPI(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request, *args, **kwargs):
#         user = get_object_or_404(User, pk=kwargs['user_id'])
#         profile = Profile.objects.get(user=user)
#         print(profile)
#         profile_serializer = RestrictedUserSerializer(profile.user)
#         return Response(profile_serializer.data)
        
#     def post(self, request, *args, **kwargs):
#         user = get_object_or_404(User, pk=kwargs['user_id'])

class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = RetrieveUpdateProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs['user_id'])
        profile = Profile.objects.get(user=user)
        profile_serializer = RetrieveUpdateProfileSerializer(profile.user)
        return Response(profile_serializer.data)
    
    def perform_update(self, serializer):
        return serializer.save()
    
    def update(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs['user_id'])
        profile = Profile.objects.get(user=user)
        serializer = RetrieveUpdateProfileSerializer(profile.user, data=request.data)
        
        serializer.is_valid(raise_exception=True)
        print("here")
        print(serializer.data)
        instance = serializer.update(instance=profile, validated_data=request.data)
        print(instance)
        serializer = RetrieveUpdateProfileSerializer(instance.user)
        return Response(serializer.data)
