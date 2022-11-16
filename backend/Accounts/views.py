from django.shortcuts import render

# Create your views here.
import rest_framework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from .serializers import SignUpSerializer
from .models import User
import jwt, datetime


class RegisterView(APIView):
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LogInView(APIView):
    def post(self,request):
        username = request.data['username']
        password = request.data['password']

        user = User.objects.filter(username = username).first()

        # if user is None:
        #     raise AuthenticationFailed('User not found')
        
        # if not user.check_password(password):
        #     raise AuthenticationFailed('Incorrect Password')
        
        token, created = Token.objects.get_or_create(user=user)
        return rest_framework.response.Response({"token": token.key})


# class UserView(APIView):
#     def get(self,request):
#         token = request.COOKIES.get('jwt')

#         if not token:
#             raise AuthenticationFailed('Unauthenticated')
        
#         try:
#             payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Unauthenticated')
        
#         user = User.objects.filter(id=payload['id']).first()
#         serializer = UserSerializer(user)

#         return Response(serializer.data)