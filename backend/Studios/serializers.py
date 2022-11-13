from email.mime import image
from rest_framework import serializers

from .models import Studio, Image, Amenity




class StudioImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['name', 'image', 'studio']

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['type', 'quantity', 'studio']

class StudioSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many = True)
    images = StudioImageSerializer(many = True)
    class Meta:
        model = Studio
        fields = ['name', 'address', 'postal_code', 'phone_number',
        'longitude', 'latitude',
         'amenities', 'images']




# class ProductSerializer(serializers.ModelSerializer):
#     store = StoreSerializer()

#     class Meta:
#         model = Product
#         fields = ['store', 'name', 'price', 'is_available']
