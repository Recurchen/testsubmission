from django.shortcuts import get_object_or_404, render
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from .serializers import SignUpSerializer, RetrieveUpdateProfileSerializer, RestrictedProfileSerializer
from .models import Profile
from django.contrib.auth.models import User

class RegisterView(APIView):
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogInView(APIView):
    permission_classes = []
    def post(self,request):
        username = request.data['username']
        password = request.data['password']

        user = authenticate(username=username, password=password)

        if user is None:
            raise AuthenticationFailed('Incorrent Username or Password')
        
        token, created = Token.objects.get_or_create(user=user)

        response_data = {
            "message": "Login Successfull",
            'username': user.username,
            'id':user.id,
            'token': token.key
        }

        return Response(data=response_data, status=status.HTTP_200_OK)



class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = RetrieveUpdateProfileSerializer

    def get_serializer_class(self):
        if self.request.user.is_staff or (
                self.request.user.id == int(self.request.parser_context["kwargs"]["user_id"])
            ):
                return RetrieveUpdateProfileSerializer
        else:
            return RestrictedProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs['user_id'])
        profile = Profile.objects.get(user=user)
        profile_serializer = self.get_serializer(profile.user)
        return Response(profile_serializer.data, status=status.HTTP_200_OK)
    
    
    def update(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs['user_id'])
        profile = Profile.objects.get(user=user)
        serializer = self.get_serializer(profile.user, data=request.data)
        
        serializer.is_valid(raise_exception=True)
        instance = serializer.update(instance=profile, validated_data=request.data)
        serializer = self.get_serializer(instance.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
