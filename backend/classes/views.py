from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework import mixins as drf_mixins
from rest_framework import viewsets as drf_viewsets
from rest_framework import pagination as drf_pagination
from classes.models import Class, ClassInstance
from classes.serializers import ClassSerializer

from rest_framework.response import Response
import datetime
from Studios.models import Studio
from Studios.serializers import StudioSerializer


# class CreateClassView(CreateAPIView):
#     serializer_class = ClassSerializer

# class ClassesAPIViewSet(
#     drf_viewsets.GenericViewSet,
#     drf_mixins.ListModelMixin,
#     drf_mixins.DestroyModelMixin,  # for deleting classes
#     drf_mixins.CreateModelMixin,  # for model creation (class)
#     drf_mixins.RetrieveModelMixin,  # for model retrieval (view class)
# ):
#     queryset = Class.objects.all()
#
#     def get_serializer_class(self):
#         if self.action == "create":
#             return ClassCreateSerializer
#         return ClassViewSerializer
#
#     def get(self, request, *args, **kwargs):
#         serializer = self.get_serializer_class()
#         return Response(serializer.data)


# class details for specific studio
class ClassesListView(ListAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        classes = Class.objects.all()
        return classes

    def get(self, request, *args, **kwargs):
        id = self.kwargs['studio_id']
        # invalid studio_id
        if not Studio.objects.filter(id=id):
            return JsonResponse({"MESSAGE": "Not Found", "STATUS": 404})
        # # this studio has no class
        # if not Class.objects.filter(studio_id=id):
        #     return Response({'no class in this studio'},)
        studio_serializer = StudioSerializer(Studio.objects.get(id=id))
        data = [{'Studio': studio_serializer.data}]

        classes_data = []
        data.append({'Classes': classes_data})
        # append class by start time(after now)
        classes = Class.objects.filter(studio_id=id).values('id')
        class_objects = []
        for i in range(0, len(classes)):
            class_objects.append(Class.objects.get(id=classes[i]['id']))

        for j in range(0, len(classes)):
            class_obj = Class.objects.get(id=classes[j]['id'])
            text_rules_inclusion = []
            for rule in class_obj.recurrences.rrules:
                text_rules_inclusion.append(rule.to_text())
            # list of categories name (keywords)
            # categories_list = []
            # for i in range(0, len(class_obj.categories.values('name'))):
            #     category_name = class_obj.categories.values('name')[i]['name']
            #     categories_list.append(category_name)

            classes_data.append({"id": class_obj.id,
                                 "name": class_obj.name,
                                 'description': class_obj.description,
                                 'coach': class_obj.coach,
                                 'capacity': class_obj.capacity,
                                 # 'start_time': class_obj.start_time,
                                 # 'end_time': class_obj.end_time,
                                 # 'start_date': class_obj.start_date,
                                 # 'end_date': class_obj.end_date,
                                 'start_time': datetime.datetime.combine(
                                     class_obj.start_date, class_obj.start_time).strftime(
                                     "%Y/%m/%d, %H:%M:%S"),
                                 'end_time': datetime.datetime.combine(
                                     class_obj.end_date, class_obj.end_time).strftime(
                                     "%Y/%m/%d, %H:%M:%S"),
                                 'frequency': text_rules_inclusion,
                                 'categories': self.categories
                                 })

        return Response(data)

        # return JsonResponse(serializer.data, safe=False)


class ClassView(RetrieveAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        return Class.objects.all()

    def get(self, request, *args, **kwargs):
        if not Class.objects.filter(id=self.kwargs['class_id']):
            return JsonResponse({"MESSAGE": "Not Found",
                                 "STATUS": 404})

        serializer = ClassSerializer(Class.objects.get(id=self.kwargs['class_id']))
        # class_obj = Class.objects.get(id=self.kwargs['class_id'])
        #
        # text_rules_inclusion = []
        # for rule in class_obj.recurrences.rrules:
        #     text_rules_inclusion.append(rule.to_text())
        #
        # # list of categories name (keywords)
        # categories_list = []
        # for i in range(0, len(class_obj.categories.values('name'))):
        #     category_name = class_obj.categories.values('name')[i]['name']
        #     categories_list.append(category_name)
        #
        # data = {"id": class_obj.id,
        #         "name": class_obj.name,
        #         'description': class_obj.description,
        #         'coach': class_obj.coach,
        #         'capacity': class_obj.capacity,
        #         'start_time': class_obj.start_time,
        #         'end_time': class_obj.end_time,
        #         'start_date': class_obj.start_date,
        #         'end_date': class_obj.end_date,
        #         'frequency': text_rules_inclusion,
        #         'categories': categories_list
        #         }
        return Response(serializer.data)

    # def get_paginated_response(self, data):
    #     """
    #     Return a paginated style `Response` object for the given output data.
    #     """
    #     assert self.paginator is not None
    #     return self.paginator.get_paginated_response(data)

#
# # not required
# class CategoriesListView(ListAPIView):
#     serializer_class = CategorySerializer
#
#     def get_queryset(self):
#         return Category.objects.all()
#
#     def get(self, request, *args, **kwargs):
#         data = [c.name for c in self.get_queryset()]
#         return JsonResponse(data, safe=False)
#
#
# class CategoryView(RetrieveAPIView):
#     serializer_class = CategorySerializer
#
#     def get(self, request, *args, **kwargs):
#         if not Category.objects.filter(id=self.kwargs['category_id']):
#             return JsonResponse({"MESSAGE": "Not Found",
#                                  "STATUS": 404})
#
#         data = [Category.objects.get(id=self.kwargs['category_id']).id,
#                 Category.objects.get(id=self.kwargs['category_id']).name]
#         return JsonResponse(data, safe=False)
