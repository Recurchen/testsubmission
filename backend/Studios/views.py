
from datetime import timezone
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
import django_filters.rest_framework
from django.db.models import Prefetch

import requests
import json

from .serializers import StudioSerializer, UserLocationSerializer
from .models import Amenity, Studio
from classes.models import Class

# Create your views here.

class StudiosListView(generics.ListCreateAPIView):
    serializer_class = UserLocationSerializer

    def get_queryset(self):
        
        studios = Studio.objects.all()
        #studios = Studio.objects.filter(name__contains = 'gym')
        #studios = Studio.objects.filter(amenities__type__contains = 'Pool')
        #studios = Studio.objects.prefetch_related(Prefetch('amenities', queryset= Amenity.objects.filter(type__contains = "Court")))
        #studios = studios.prefetch_related(Prefetch('classes', queryset= Class.objects.filter(name__contains = "Cardio"))).all()
        return studios

    def get_queryset_sorted(self, origin, name, type, class_name, coach):
        
        def calculate_dist(origin, destination):
            url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+origin+"&destinations="+destination+"&units=imperial&key=AIzaSyCcnFNK3iBodsyc0utQgF0ULxB_wS8pAMs"

            payload={}
            headers = {}

            response = requests.request("GET", url, headers=headers, data=payload)

            content = response.text
            json_data = json.loads(content)
            seconds = json_data["rows"][0]["elements"][0]["duration"]["value"]

            return seconds

        if name == None:
            studios = Studio.objects.all()
        else:
            # studios = Studio.objects.prefetch_related(Prefetch('amenities', queryset= Amenity.objects.filter(type__contains = type))).all()
            # Status.objects.prefetch_related(Prefetch('tasks', queryset = Task.objects.filter(contact=contactID))).all()
            studios = Studio.objects.filter(name__contains = name, amenities__type__contains = type, classes__name__contains = class_name, classes__coach__contains = coach)
            #studios = studios.filter(name__contains = name)
            # studios = studios.prefetch_related(Prefetch('amenities', queryset= Amenity.objects.filter(type__contains = type))).all()
            #studios = studios.prefetch_related(Prefetch('classes', queryset= Class.objects.filter(name__contains = class_name))).all()
            #studios = studios.prefetch_related(Prefetch('amenities', queryset= Amenity.objects.filter(type__contains = type)), Prefetch('classes', queryset= Class.objects.filter(name__contains = class_name))).all()
        sorted_studios = sorted(studios, key = lambda studio: calculate_dist(origin, studio.address), reverse = False)
        return sorted_studios

    def list(self, request):
        queryset = self.get_queryset()
        serializer = StudioSerializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = UserLocationSerializer(data=request.data)

        if serializer.is_valid():
            origin_data = serializer.data.get('location')
            name_data = serializer.data.get('name')
            amenities = serializer.data.get('amenities')
            class_name = serializer.data.get('class_name')
            coach = serializer.data.get('coach')
        
        
        if not filter:
            queryset = self.get_queryset_sorted(origin_data, name_data, amenities)

        else:
            queryset = self.get_queryset_sorted(origin_data, name_data, amenities, class_name, coach)
        serializer = StudioSerializer(queryset, many=True)

        return Response(serializer.data)


class StudioDetailView(generics.RetrieveAPIView):
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, id=self.kwargs['studio_id'])
