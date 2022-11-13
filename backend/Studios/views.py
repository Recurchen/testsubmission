from http.client import HTTPResponse
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from django.views import View

import json

from .serializers import StudioSerializer
from .models import Studio

# Create your views here.

api_key = 'AIzaSyCcnFNK3iBodsyc0utQgF0ULxB_wS8pAMs'

class StudiosAPIView(APIView):
    serializer_class = StudioSerializer

    def get_queryset(self):
        studios = Studio.objects.all()
        return studios

    def get(self, request, *args, **kwargs):
        studios = self.get_queryset()
        serializer = StudioSerializer(studios, many = True)

        return Response(serializer.data)

import requests
from urllib.parse import urlencode





# def test_view(request):
#     res = extract_lat_lng("1600 Amphitheatre Parkway, Mountain View, CA")
#     return Response(res)

class TestView(APIView):
    
    def get(self, request):
        url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington%2C%20DC&destinations=New%20York%20City%2C%20NY&units=imperial&key=AIzaSyCcnFNK3iBodsyc0utQgF0ULxB_wS8pAMs"

        payload={}
        headers = {}

        response = requests.request("GET", url, headers=headers, data=payload)

        content = response.text
        json_data = json.loads(content)


        return Response(f"{json_data}")