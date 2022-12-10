from email.mime import image
from rest_framework import serializers

from .models import Studio, Image, Amenity
from classes.models import Class


class StudioImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['name', 'image', 'studio']

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['type', 'quantity', 'studio']

class StudioClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['name', 'coach']

class StudioSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many = True)
    images = StudioImageSerializer(many = True)
    classes = StudioClassSerializer(many = True)
    
    class Meta:
        model = Studio
        fields = ['id', 'name', 'address', 'postal_code', 'phone_number',
        'longitude', 'latitude',
         'amenities', 'images',
         'classes']

class UserLocationSerializer(serializers.Serializer):
    location = serializers.CharField(max_length = 255)
