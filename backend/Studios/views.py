from datetime import timezone
from django.shortcuts import get_object_or_404


from rest_framework.response import Response
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
import django_filters.rest_framework

import requests
import json

from .serializers import StudioSerializer, UserLocationSerializer
from .models import Studio

# Create your views here.

class StudiosListView(generics.ListCreateAPIView):
    serializer_class = UserLocationSerializer

    def get_queryset(self):
        studios = Studio.objects.all()
        #studios = Studio.objects.filter(name__contains='Athletic')
        return studios
        # ename = self.request.query_params.get("name", None)
        # if ename:
        #     # queryset = queryset.filter(purchaser__username=username)
        #     qs = Studio.objects.filter(name = ename)
        #     print('e')
        #     return qs
        
        # return super().get_queryset()




    def get_queryset_sorted(self, origin, filter=None):
        
        def calculate_dist(origin, destination):
            url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+origin+"&destinations="+destination+"&units=imperial&key=AIzaSyCcnFNK3iBodsyc0utQgF0ULxB_wS8pAMs"

            payload={}
            headers = {}
        
            response = requests.request("GET", url, headers=headers, data=payload)

            content = response.text
            json_data = json.loads(content)
            seconds = json_data["rows"][0]["elements"][0]["duration"]["value"]

            return seconds

        if filter == None:
            studios = Studio.objects.all()
        else:
            studios = Studio.objects.filter(name__contains = filter)
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
        
        filter = True
        if not filter:
            queryset = self.get_queryset_sorted(origin_data, 'gym')

        else:
            queryset = self.get_queryset_sorted(origin_data)
        serializer = StudioSerializer(queryset, many=True)

        return Response(serializer.data)


class StudioDetailView(generics.RetrieveAPIView):
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, id=self.kwargs['studio_id'])