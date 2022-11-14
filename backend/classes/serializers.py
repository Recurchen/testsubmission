from rest_framework import serializers

from classes.models import Category, Class

from Studios.serializers import StudioSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        # read_only_fields = ['id','name']


class ClassSerializer(serializers.ModelSerializer):
    studio = StudioSerializer()
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, write_only=True)

    class Meta:
        model = Class
        fields = ['id', 'studio', 'name', 'description', 'coach', 'capacity', 'recurrences',
                  'start_time', 'end_time', 'start_date', 'end_date', 'categories', 'category_ids']

    def create(self, validated_data):
        return super().create(validated_data)

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
