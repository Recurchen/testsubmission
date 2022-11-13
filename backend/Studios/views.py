from datetime import timezone
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



class TestView(APIView):
    
    def get(self, request):
        origin = '43.6629, -79.3957' # UTSG 

        destinations = ('43.5483, -79.6627', 'One Bloor St', 'Canada Wonderland', "M4K 2N2")
        dest_order = {}

        #destination = '43.5483, -79.6627' # UTM
        #destination = '3 Gloucester St' # home
        for i in range(len(destinations)):
            origin = '43.6629, -79.3957'
            destination = destinations[i]
            url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + origin + "&destinations="+destination+"&units=imperial&key=AIzaSyCcnFNK3iBodsyc0utQgF0ULxB_wS8pAMs"

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