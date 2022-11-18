# import django_filters
from rest_framework.generics import get_object_or_404, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
# from rest_framework import mixins as drf_mixins
# from rest_framework import viewsets as drf_viewsets
# from rest_framework import pagination as drf_pagination
# from rest_framework.permissions import IsAuthenticated
from classes.models import Class, ClassInstance
from classes.serializers import ClassInstancesSerializer, ClassSerializer
from rest_framework.response import Response
import datetime
from Studios.models import Studio
from Studios.serializers import StudioSerializer


class ClassInstancesListView(ListAPIView):
    # permission_classes = (IsAuthenticated,)
    serializer_class = ClassInstance
    queryset = ClassInstance.objects.all()

    # helpers
    def future_instances(self, class_instances):
        future_class_instances = []  # future class instances for all belonged classes
        now = datetime.datetime.now()  # default timezone is utc
        for i in class_instances:
            class_start_time = datetime.datetime.combine(i.class_date, i.start_time)
            if class_start_time >= now and i.is_cancelled is False:
                future_class_instances.append(i)
        # sort class instances with insertion sort algo
        for i in range(1, len(future_class_instances)):
            key_item = future_class_instances[i]
            j = i - 1
            key_item_start = datetime.datetime.combine(key_item.class_date, key_item.start_time)

            while j >= 0 and datetime.datetime.combine(future_class_instances[j].class_date,
                                                       future_class_instances[j].start_time) > \
                    key_item_start:
                future_class_instances[j + 1] = future_class_instances[j]
                j -= 1
            future_class_instances[j + 1] = key_item
        return future_class_instances

    def filter(self, request, filter_by, keys):
        if filter_by == 'class_name':
            class_name = request.GET.get(keys[1])
            return self.filter_by_class_name(class_name)
        elif filter_by == 'coach':
            coach = request.GET.get(keys[1])
            return self.filter_by_coach(coach)
        elif filter_by == 'date':
            date = request.GET.get(keys[1])
            return self.filter_by_date(date)
        elif filter_by == 'time_range':
            start = request.GET.get(keys[1])
            end = request.GET.get(keys[2])
            return self.filter_by_time_range(start, end)
        return

    def filter_by_coach(self, coach):
        classes = []
        class_ids = Class.objects.filter(coach=coach).values('id')
        for i in range(0, len(class_ids)):
            classes.append(Class.objects.get(id=class_ids[i]['id']))
        class_instances = []
        for c in classes:
            class_instance_ids = ClassInstance.objects.filter(
                belonged_class=c).values('id')
            for i in range(0, len(class_instance_ids)):
                class_instances.append(ClassInstance.objects.get(
                    id=class_instance_ids[i]['id']))
        data = []
        future_instances = self.future_instances(class_instances)
        for c in future_instances:
            class_instance_serializer = ClassInstancesSerializer(c)
            data.append(class_instance_serializer.data)
        return data

    def filter_by_class_name(self, class_name):
        classes = []
        class_ids = Class.objects.filter(name=class_name).values('id')
        for i in range(0, len(class_ids)):
            classes.append(Class.objects.get(id=class_ids[i]['id']))
        class_instances = []
        for c in classes:
            class_instance_ids = ClassInstance.objects.filter(
                belonged_class=c).values('id')
            for i in range(0, len(class_instance_ids)):
                class_instances.append(ClassInstance.objects.get(
                    id=class_instance_ids[i]['id']))
        data = []
        future_instances = self.future_instances(class_instances)
        for c in future_instances:
            class_instance_serializer = ClassInstancesSerializer(c)
            data.append(class_instance_serializer.data)
        return data

    def filter_by_date(self, date):
        class_instances = []
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        class_instance_ids = ClassInstance.objects.filter(class_date=date).values('id')
        for i in range(0, len(class_instance_ids)):
            class_instances.append(ClassInstance.objects.get(id=class_instance_ids[i]['id']))
        data = []
        future_instances = self.future_instances(class_instances)
        for c in future_instances:
            class_instance_serializer = ClassInstancesSerializer(c)
            data.append(class_instance_serializer.data)
        return data

    def filter_by_time_range(self, start, end):
        """filter class instances by their start time and end time (no date)"""
        class_instances = []
        class_instance_ids = ClassInstance.objects.filter(start=start, end=end).values('id')
        for i in range(0, len(class_instance_ids)):
            class_instances.append(ClassInstance.objects.get(id=class_instance_ids[i]['id']))
        data = []
        future_instances = self.future_instances(class_instances)
        for c in future_instances:
            class_instance_serializer = ClassInstancesSerializer(c)
            data.append(class_instance_serializer.data)
        return data

    def post(self, request, *args, **kwargs):
        # get query parameters
        keys = list(request.GET.keys())
        length = len(keys)
        if length <= 1:
            return Response({"details": "Invalid post request"})
        method = keys[0]
        if method == 'filter':
            filter_by = request.GET.get(method)
            if length == 3 and filter_by == 'time_range' and keys[1] == 'start' and \
                    keys[2] == 'end':
                data = self.filter(request, filter_by, keys)
                return Response(data)
            elif length == 2:
                if filter_by == 'class_name' and keys[1] == 'class_name':
                    data = self.filter(request, filter_by, keys)
                    return Response(data)
                elif filter_by == 'coach' and keys[1] == 'coach':
                    data = self.filter(request, filter_by, keys)
                    return Response(data)
                elif filter_by == 'date' and keys[1] == 'date':
                    data = self.filter(request, filter_by, keys)
                    return Response(data)

        elif method == 'search':
            pass

        return Response({"details": "Invalid post request"})

    def get(self, request, *args, **kwargs):
        id = self.kwargs['studio_id']
        # invalid studio_id
        if not Studio.objects.filter(id=id):
            return Response({"MESSAGE": "Not Found", "STATUS": 404})
        # # this studio has no class
        # if not Class.objects.filter(studio_id=id):
        #     return Response({'no class in this studio'},)
        studio_serializer = StudioSerializer(Studio.objects.get(id=id))
        data = [{'Studio': studio_serializer.data}]
        classes_data = []
        data.append({'Classes': classes_data})
        # append class instances after now by start time
        class_ids = Class.objects.filter(studio_id=id).values('id')
        class_objects = []  # classes belong to the studio
        for i in range(0, len(class_ids)):
            class_objects.append(Class.objects.get(id=class_ids[i]['id']))

        future_class_instances = []  # future class instances for all belonged classes
        for c in class_objects:
            class_instance_ids = ClassInstance.objects.filter(belonged_class=c).values('id')
            class_instances = [ClassInstance.objects.get(id=class_instance_ids[i]['id'])
                               for i in range(0, len(class_instance_ids))]
            now = datetime.datetime.now()  # default timezone is utc
            for i in class_instances:
                class_start_time = datetime.datetime.combine(i.class_date, i.start_time)
                if class_start_time >= now and i.is_cancelled is False:
                    future_class_instances.append(i)
        # sort class instances with insertion sort algo
        for i in range(1, len(future_class_instances)):
            key_item = future_class_instances[i]
            j = i - 1
            key_item_start = datetime.datetime.combine(key_item.class_date, key_item.start_time)

            while j >= 0 and datetime.datetime.combine(future_class_instances[j].class_date,
                                                       future_class_instances[j].start_time) > \
                    key_item_start:
                future_class_instances[j + 1] = future_class_instances[j]
                j -= 1
            future_class_instances[j + 1] = key_item
        # display class instances: in toronto timezone
        for c in future_class_instances:
            class_instance_serializer = ClassInstancesSerializer(c)
            classes_data.append(class_instance_serializer.data)

        # for j in range(0, len(classes)):
        #     class_obj = Class.objects.get(id=classes[j]['id'])
        #     text_rules_inclusion = []
        #     for rule in class_obj.recurrences.rrules:
        #         text_rules_inclusion.append(rule.to_text())
        #     # list of categories name (keywords)
        #     # categories_list = []
        #     # for i in range(0, len(class_obj.categories.values('name'))):
        #     #     category_name = class_obj.categories.values('name')[i]['name']
        #     #     categories_list.append(category_name)
        #
        #     classes_data.append({"id": class_obj.id,
        #                          "name": class_obj.name,
        #                          'description': class_obj.description,
        #                          'coach': class_obj.coach,
        #                          'capacity': class_obj.capacity,
        #                          # 'start_time': class_obj.start_time,
        #                          # 'end_time': class_obj.end_time,
        #                          # 'start_date': class_obj.start_date,
        #                          # 'end_date': class_obj.end_date,
        #                          'start_time': datetime.datetime.combine(
        #                              class_obj.start_date, class_obj.start_time).strftime(
        #                              "%Y/%m/%d, %H:%M:%S"),
        #                          'end_time': datetime.datetime.combine(
        #                              class_obj.end_date, class_obj.end_time).strftime(
        #                              "%Y/%m/%d, %H:%M:%S"),
        #                          'frequency': text_rules_inclusion,
        #                          'categories': self.categories
        #                          })

        return Response(data)


class ClassView(RetrieveAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        return Class.objects.all()

    def get(self, request, *args, **kwargs):
        if not Class.objects.filter(id=self.kwargs['class_id']):
            return Response({"MESSAGE": "Not Found",
                             "STATUS": 404})

        serializer = ClassSerializer(Class.objects.get(id=self.kwargs['class_id']))

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
