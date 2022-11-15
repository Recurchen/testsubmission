from rest_framework import serializers
from classes.models import Class, ClassInstance
from Studios.serializers import StudioSerializer
from rest_framework.response import Response

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
        fields = ['id', 'studio', 'name', 'description', 'coach', 'capacity', 'recurrences',
                  'start_time', 'end_time', 'start_date', 'end_date', 'categories']


class ClassInstancesSerializer(serializers.ModelSerializer):
    belonged_class = ClassSerializer()

    class Meta:
        model = ClassInstance
        fields = ['belonged_class', 'is_full', 'is_cancelled', 'start_time',
                  'end_time', 'class_date', 'capacity']

# class ClassOccurrencesCreateSerializer(serializers.ModelSerializer):
#     studio = StudioSerializer()
#     categories = CategorySerializer(many=True)
#     category_ids = serializers.PrimaryKeyRelatedField(
#         queryset=Category.objects.all(), many=True)
#     # classes = ClassSerializer(many=True)
#     class Meta:
#         model = Class
#         fields = ['id', 'studio', 'name', 'description', 'coach', 'capacity', 'recurrences',
#                   'start_time', 'end_time', 'start_date', 'end_date', 'categories']


# class ClassViewSerializer(serializers.ModelSerializer):
#     studio = StudioSerializer()
#     categories = CategorySerializer(many=True, read_only=True)
#     category_ids = serializers.PrimaryKeyRelatedField(
#         queryset=Category.objects.all(), many=True, write_only=True)
#     occurrences = serializers.SerializerMethodField()
#
#     class Meta:
#         model = Class
#         fields = ['id', 'studio', 'name', 'description', 'coach', 'capacity', 'recurrences',
#                   'start_time', 'end_time', 'start_date', 'end_date', 'categories', 'category_ids']
#         def get_occurrences(self, my_class):
#             return ClassViewSerializer(my_class.occurrences, many=True).data
#


    # def create(self, validated_data):
    #     return Response(validated_data)
    #     return super().create(validated_data)


    # def create(self, validated_data):
    #     return super().create(validated_data)
    #
    # def update(self, instance, validated_data):
    #     instance.name = validated_data.get('name', instance.name)
    #     instance.description = validated_data.get('description', instance.description)
    #     instance.coach = validated_data.get('coach', instance.coach)
    #     instance.capacity = validated_data.get('capacity', instance.capacity)
    #     instance.start_time = validated_data.get('start_time', instance.start_time)
    #     instance.end_time = validated_data.get('end_time', instance.end_time)
    #     instance.save()
    #     return instance
