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
                  'start_time', 'end_time', 'start_date', 'end_date', 'categories']


class ClassInstanceSerializer(serializers.ModelSerializer):
    belonged_class = ClassSerializer()
    # class_name = serializers.CharField(source='belonged_class.name')
    coach = serializers.CharField(source='belonged_class.coach')

    class Meta:
        model = ClassInstance
        fields = ['belonged_class', 'coach', 'is_full', 'is_cancelled', 'start_time',
                  'end_time', 'class_date', 'capacity']


class EnrollmentSerializer(serializers.ModelSerializer):
    class_instance = ClassInstanceSerializer()
    class Meta:
        model = Enrollment
        fields = ['user', 'class_instance']
