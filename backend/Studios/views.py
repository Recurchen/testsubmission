from datetime import timezone
from http.client import HTTPResponse
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from django.views import View

import json

from .serializers import StudioSerializer, UserLocationSerializer
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



class TestView(APIView):
    serializer_class = UserLocationSerializer

    def get(self, request, *args, **kwargs):
        return Response({})
    
    def post(self, request, *args, **kwargs):
        serializer = UserLocationSerializer(data=request.data)

        if serializer.is_valid():
            origin_data = serializer.data.get('location')
        # else:
        #     return Response(
        #         serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

        studios = Studio.objects.all()

        #destinations = ('43.5483, -79.6627', 'One Bloor St', 'Canada Wonderland')
        dest_order = {}

        #for i in range(len(destinations)):
        for studio in studios:
            origin = origin_data
            destination = studio.address
            url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+origin+"&destinations="+destination+"&units=imperial&key=AIzaSyCcnFNK3iBodsyc0utQgF0ULxB_wS8pAMs"

            payload={}
            headers = {}
        
            response = requests.request("GET", url, headers=headers, data=payload)

            content = response.text
            json_data = json.loads(content)
            time = json_data["rows"][0]["elements"][0]["duration"]["text"]
            origin = json_data['origin_addresses']
            dest = json_data['destination_addresses'][0]
            seconds = json_data["rows"][0]["elements"][0]["duration"]["value"]

            dest_order[dest] = seconds

        dest_sorted = sorted(dest_order.items(), key=lambda x: x[1])


        return Response({'origin': origin,\
                         'sorted_destinations':dest_sorted,
                         'best_destinations': next(iter(dest_sorted))})