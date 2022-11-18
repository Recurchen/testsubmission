from rest_framework import serializers
from classes.models import Class, ClassInstance
from Studios.serializers import StudioSerializer

#
# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = ['id', 'name']


class ClassSerializer(serializers.ModelSerializer):
    studio = StudioSerializer()
    # categories = CategorySerializer(many=True)
    # category_ids = serializers.PrimaryKeyRelatedField(
    #     queryset=Category.objects.all(), many=True)

    class Meta:
        model = Class
        fields = ['name', 'id', 'studio', 'description', 'coach', 'capacity', 'recurrences',
                  'start_time', 'end_time', 'start_date', 'end_date', 'categories']


class ClassInstancesSerializer(serializers.ModelSerializer):
    belonged_class = ClassSerializer()
    class Meta:
        model = ClassInstance
        fields = ['belonged_class', 'is_full', 'is_cancelled', 'start_time',
                  'end_time', 'class_date', 'capacity']
