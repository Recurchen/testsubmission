from rest_framework import serializers
from classes.models import Class, ClassInstance, Enrollment
from Studios.serializers import StudioSerializer


class ClassSerializer(serializers.ModelSerializer):
    studio = StudioSerializer()
    # categories = CategorySerializer(many=True)
    # category_ids = serializers.PrimaryKeyRelatedField(
    #     queryset=Category.objects.all(), many=True)
    class Meta:
        model = Class
        fields = ['name', 'id', 'studio', 'description', 'coach', 'capacity', 'recurrences',
                  'start_time', 'end_time', 'start_date', 'end_date', 'categories',
                  'all_cancelled']


class ClassInstanceSerializer(serializers.ModelSerializer):
    belonged_class = ClassSerializer()
    start_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    end_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = ClassInstance
        fields = ['id', 'belonged_class', 'is_full', 'is_cancelled', 'start_time',
                  'end_time', 'class_date', 'capacity']


class EnrollmentSerializer(serializers.ModelSerializer):
    class_instance = ClassInstanceSerializer()
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'class_instance', 'is_cancelled', 'class_start_time', 'in_future']
