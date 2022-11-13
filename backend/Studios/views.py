from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import StudioSerializer
from .models import Studio

# Create your views here.

class StudiosAPIView(APIView):
    serializer_class = StudioSerializer

    def get_queryset(self):
        studios = Studio.objects.all()
        return studios

    def get(self, request, *args, **kwargs):
        studios = self.get_queryset()
        serializer = StudioSerializer(studios, many = True)

        return Response(serializer.data)