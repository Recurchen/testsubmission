from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
# from rest_framework import mixins as drf_mixins
# from rest_framework import viewsets as drf_viewsets
# from rest_framework import pagination as drf_pagination
from classes.models import Category, Class
from classes.serializers import CategorySerializer, ClassSerializer
from django.shortcuts import get_object_or_404


# class CreateClassView(CreateAPIView):
#     serializer_class = ClassSerializer
#
#     def get(self, request, *args, **kwargs):
#         return Response({})
#
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         # recurrences = data['recurrences']
#         # recurrence.base.rule_to_text(recurrences)
#         # # "name": "", "description": "", "coach": "", "capacity": "", "recurrences": "",
#         "start_time": "", "end_time": "", "start_date": "", "end_date": ""
#         r_list = data['recurrences'].split(',')
#         if len(r_list)
#         RECURRENCE_CHOICES = ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY']
#
#         rule = recurrence.Rule(recurrence.WEEKLY, byday=recurrence.MONDAY)
#         return self.create(request, *args, **kwargs)


# class details for specific studio
class ClassesListView(ListAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        classes = Class.objects.all()
        return classes

    def get(self, request, *args, **kwargs):
        id = self.kwargs['studio_id']
        if not Class.objects.filter(studio_id=id):
            return JsonResponse({"MESSAGE": "Not Found",
                                 "STATUS": 404})
        classes = self.get_queryset()
        serializer = ClassSerializer(classes, many=True)
        return JsonResponse(serializer.data, safe=False)


class ClassView(RetrieveAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        return Class.objects.all()

    def get(self, request, *args, **kwargs):
        if not Class.objects.filter(id=self.kwargs['class_id']):
            return JsonResponse({"MESSAGE": "Not Found",
                                 "STATUS": 404})

        # serializer = ClassSerializer(Class.objects.get(id=self.kwargs['class_id']))
        class_obj = Class.objects.get(id=self.kwargs['class_id'])

        text_rules_inclusion = []
        for rule in class_obj.recurrences.rrules:
            text_rules_inclusion.append(rule.to_text())

        # list of categories name (keywords)
        categories_list = []
        for i in range(0, len(class_obj.categories.values('name'))):
            category_name = class_obj.categories.values('name')[i]['name']
            categories_list.append(category_name)

        data = {"id": class_obj.id,
                "name": class_obj.name,
                'description': class_obj.description,
                'coach': class_obj.coach,
                'capacity': class_obj.capacity,
                'start_time': class_obj.start_time,
                'end_time': class_obj.end_time,
                'start_date': class_obj.start_date,
                'end_date': class_obj.end_date,
                'frequency': text_rules_inclusion,
                'categories': categories_list
                }
        return JsonResponse(data, safe=False)

    # def get_paginated_response(self, data):
    #     """
    #     Return a paginated style `Response` object for the given output data.
    #     """
    #     assert self.paginator is not None
    #     return self.paginator.get_paginated_response(data)


# not required
class CategoriesListView(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.all()

    def get(self, request, *args, **kwargs):
        data = [c.name for c in self.get_queryset()]
        return JsonResponse(data, safe=False)


class CategoryView(RetrieveAPIView):
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        if not Category.objects.filter(id=self.kwargs['category_id']):
            return JsonResponse({"MESSAGE": "Not Found",
                                 "STATUS": 404})

        data = [Category.objects.get(id=self.kwargs['category_id']).id,
                Category.objects.get(id=self.kwargs['category_id']).name]
        return JsonResponse(data, safe=False)
