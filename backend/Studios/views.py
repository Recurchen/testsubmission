
from datetime import timezone
from pydoc import classname
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from rest_framework.response import Response
from functools import reduce
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
import django_filters.rest_framework
from django.db.models import Q
from django.db.models import Prefetch
from operator import and_, or_
import requests
import json

from .serializers import StudioSerializer, UserLocationSerializer
from .models import Amenity, Studio
from classes.models import Class
from rest_framework.pagination import PageNumberPagination



# Create your views here.
class StudioPagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 2


class StudiosListView(generics.ListCreateAPIView):
    pagination_class = StudioPagination
    serializer_class = UserLocationSerializer

    def get_queryset(self):
        name = self.request.query_params.get('name') or ''
        amenities = self.request.query_params.get('amenities') or ''
        class_name = self.request.query_params.get('class') or ''
        coach = self.request.query_params.get('coach') or ''

        # 1 or more amenities searching and
        # 1 or more classes searching at the same time
        if (len(amenities) > 0 and ' ' in amenities) \
            and (len(class_name) > 0 and ' ' in class_name):
            amenities_list = amenities.split()
            class_list = class_name.split()

            # set the amenities condition check
            condition1 = Q(amenities__type__contains=amenities_list[0])
            if len(amenities_list) >= 1:
                for amenity in amenities_list[1:]:
                    condition1 |= Q(amenities__type__contains=amenity)

            # set the classes condition check
            condition2 = Q(classes__name__contains = class_list[0])
            if len(class_list) >= 1:
                for class_name in class_list[1:]:
                    condition2 |= Q(classes__name__contains=class_name)

            studios = Studio.objects.filter(
                                        condition1,
                                        condition2,
                                        name__contains = name,
                                        classes__coach__contains = coach
                                        ).distinct()
        
        # only 1 or more amenities search
        elif len(amenities) > 0 and ' ' in amenities:
            amenities_list = amenities.split()

            # set the amenities condition check
            condition1 = Q(amenities__type__contains=amenities_list[0])
            if len(amenities_list) >= 1:
                for amenity in amenities_list[1:]:
                    condition1 |= Q(amenities__type__contains=amenity)

            studios = Studio.objects.filter(
                                        condition1,
                                        classes__name__contains = class_name, \
                                        name__contains = name,
                                        classes__coach__contains = coach
                                        ).distinct()

        # only 1 or more classes search
        elif (len(class_name) > 0 and ' ' in class_name):
            class_list = class_name.split()

            # set the classes condition check
            condition2 = Q(classes__name__contains = class_list[0])
            if len(class_list) >= 1:
                for class_name in class_list[1:]:
                    condition2 |= Q(classes__name__contains=class_name)

            studios = Studio.objects.filter(condition2,
                                        name__contains = name,
                                        name__contains = name,
                                        classes__coach__contains = coach
                                        ).distinct()        

        # general search, not multiple key words for classes and amenities
        else:    
            studios = Studio.objects.filter(name__contains = name, \
                                        amenities__type__contains = amenities, \
                                        classes__name__contains = class_name, \
                                        classes__coach__contains = coach
                                        ).distinct()

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

        studios = Studio.objects.filter(name__contains = name, \
                                        amenities__type__contains = type, \
                                        classes__name__contains = class_name, \
                                        classes__coach__contains = coach)
        sorted_studios = sorted(studios, key = lambda studio: calculate_dist(origin, studio.address), reverse = False)
        return sorted_studios

    def list(self, request):
        pagination_class = StudioPagination
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
        
        
            queryset = self.get_queryset_sorted(origin_data, name_data, amenities, class_name, coach)
        serializer = StudioSerializer(queryset, many=True)

        return Response(serializer.data)


class StudioDetailView(generics.RetrieveAPIView):
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, id=self.kwargs['studio_id'])
