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

    def search(self, by, value):
        if by == 'class_name':
            return self.search_by_class_name(value)
        elif by == 'coach':
            return self.search_by_coach(value)
        elif by == 'date':
            return self.search_by_date(value)
        elif by == 'time_range':
            time = value.split(",")
            start = time[0]
            end = time[1]
            return self.search_by_time_range(start, end)
        return

    def search_by_coach(self, coach):
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
        future_instances = self.future_instances(class_instances)
        return future_instances

    def search_by_class_name(self, class_name):
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
        future_instances = self.future_instances(class_instances)
        return future_instances

    def search_by_date(self, date):
        class_instances = []
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        class_instance_ids = ClassInstance.objects.filter(class_date=date).values('id')
        for i in range(0, len(class_instance_ids)):
            class_instances.append(ClassInstance.objects.get(id=class_instance_ids[i]['id']))
        future_instances = self.future_instances(class_instances)
        return future_instances

    def search_by_time_range(self, start, end):
        """filter class instances by their start time in the range of (start,end)
        start and end are type datetime.time"""
        start = datetime.datetime.strptime(start, '%H:%M').time()
        end = datetime.datetime.strptime(end, '%H:%M').time()
        class_instances = []
        class_instance_ids = ClassInstance.objects.filter(
            start_time__range=(start, end)).values('id')
        for i in range(0, len(class_instance_ids)):
            class_instances.append(ClassInstance.objects.get(id=class_instance_ids[i]['id']))
        future_instances = self.future_instances(class_instances)
        return future_instances

    def post(self, request, *args, **kwargs):
        # get query parameters
        # if any one isn't in allowed search/filter option, return invalid post request too
        keys = list(request.GET.keys())
        length = len(keys)
        if length < 1:
            return Response({"details": "Invalid post request"})
        if length == 1:
            # search has only 1 query
            method = 'search'
        else:
            # filter has more than 1 query
            method = 'filter'

        if method == 'search':
            by = keys[0]
            value = request.GET.get(by)
            by_list = ['class_name', 'coach', 'date', 'time_range']
            if by in by_list:
                searched_instances = self.search(by, value)
                data = []
                for c in searched_instances:
                    class_instance_serializer = ClassInstancesSerializer(c)
                    data.append(class_instance_serializer.data)
                return Response(data)
            else:
                return Response({"details": "Invalid post request"})

        elif method == 'filter':
            bys = keys
            by_list = ['class_name', 'coach', 'date', 'time_range']
            potential_instances = []
            for by in bys:
                if by in by_list:
                    value = request.GET.get(by)
                    searched_instances = self.search(by, value)
                    potential_instances.append(searched_instances)
                else:
                    return Response({"details": "Invalid post request"})
            if potential_instances == []:
                return Response([])

            intersected_instances = list(set.intersection(*map(set, potential_instances)))
            data = []
            for i in intersected_instances:
                class_instance_serializer = ClassInstancesSerializer(i)
                data.append(class_instance_serializer.data)
            return Response(data)

        return Response({"details": "Invalid post request"})

    def get(self, request, *args, **kwargs):
        id = self.kwargs['studio_id']
        if not Studio.objects.filter(id=id):
            return Response({"MESSAGE": "Not Found", "STATUS": 404})
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
