from typing import List
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.generics import CreateAPIView, DestroyAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from classes.models import Class, ClassInstance, Enrollment
from classes.serializers import ClassInstanceSerializer, EnrollmentSerializer
from rest_framework.response import Response
import datetime
from Accounts.models import Profile
from Studios.models import Studio


def drop_class_after(after: datetime.datetime, user: User):
    user_enrollments = list(Enrollment.objects.filter(user=user))
    for e in user_enrollments:
        if e.class_instance.start_time > after:
            i = e.class_instance
            e.delete()
            i.capacity += 1
            i.save()


def future_instances(class_instances: List[ClassInstance]) -> List[ClassInstance]:
    classins_ids = [c.id for c in class_instances]
    now = datetime.datetime.now()
    return ClassInstance.objects.filter(start_time__gt=now, is_cancelled=False,
                                        id__in=classins_ids).order_by('start_time')


def search(by: str, value: str, studio_id: int) -> List[ClassInstance]:
    if by == 'class_name':
        return search_by_class_name(value, studio_id)
    elif by == 'coach':
        return search_by_coach(value, studio_id)
    elif by == 'date':
        return search_by_date(value, studio_id)
    elif by == 'time_range':
        time = value.split(",")
        start = time[0]
        end = time[1]
        return search_by_time_range(start, end, studio_id)


def search_by_coach(coach: str, studio_id: int) -> List[ClassInstance]:
    classes = list(Class.objects.filter(coach=coach, studio_id=studio_id))
    class_instances = [ClassInstance.objects.get(belonged_class=c) for c in classes]
    return future_instances(class_instances)


def search_by_class_name(class_name: str, studio_id: int) -> List[ClassInstance]:
    classes = list(Class.objects.filter(name=class_name, studio_id=studio_id))
    class_instances = [ClassInstance.objects.get(belonged_class=c) for c in classes]
    return future_instances(class_instances)


def search_by_date(date: str, studio_id: int) -> List[ClassInstance]:
    classes = list(Class.objects.filter(studio_id=studio_id))
    date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
    class_instances = list(ClassInstance.objects.filter(
        belonged_class__in=classes, class_date=date))
    return future_instances(class_instances)


def search_by_time_range(start: str, end: str, studio_id: int) -> List[ClassInstance]:
    """filter class instances by their start time in the range of (start,end)
            start and end are type datetime.time"""
    start = datetime.datetime.strptime(start, '%H:%M').time()
    end = datetime.datetime.strptime(end, '%H:%M').time()
    classes = list(Class.objects.filter(studio_id=studio_id))
    class_instances = list(ClassInstance.objects.filter(
        belonged_class__in=classes, start_time__range=(start, end)))
    return future_instances(class_instances)


class EnrollClassView(CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.GET.get('class_id', '') == '':
            return Response({"details: no class_id para in the request"},
                            status=status.HTTP_400_BAD_REQUEST)
        if request.GET.get('class_date', '') == '':
            return Response({"details: no class_date para in the request"},
                            status=status.HTTP_400_BAD_REQUEST)
        user = Profile.objects.get(user=self.request.user)

        if user and not user.is_subscribed:
            return Response({"details: user isn't an active subscriber"},
                             status=status.HTTP_401_UNAUTHORIZED)
        class_date = request.GET.get('class_date')
        class_obj = Class.objects.filter(id=request.GET.get('class_id'))
        if not class_obj:
            return Response({"details: no such class with this id"},
                            status=status.HTTP_404_NOT_FOUND)
        class_obj = list(class_obj)[0]
        # enroll all future class instances
        if class_date == 'all':
            class_instances = list(ClassInstance.objects.filter(belonged_class=class_obj))
            future_class_instances = list(future_instances(class_instances))
        # enrol in a future class occurrence
        else:
            try:
                class_date = datetime.datetime.strptime(request.GET.get('class_date'),
                                                        '%Y-%m-%d').date()
            except ValueError:
                return Response({"details: invalid class_date format. "
                                 "Please enter in the format of %Y-%m-%d"},
                                status=status.HTTP_400_BAD_REQUEST)

            if class_date < datetime.datetime.now().date():
                return Response({"details: This class_date is not in the future"},
                                status=status.HTTP_404_NOT_FOUND)

            class_instances = list(ClassInstance.objects.filter(belonged_class=class_obj,
                                                                class_date=class_date))
            if class_instances == []:
                return Response({"details: No class occurrence with this date"},
                                status=status.HTTP_404_NOT_FOUND)

            future_class_instances = list(future_instances(class_instances))

        if future_class_instances == []:
            return Response({"details: This class has no future occurrence"},
                            status=status.HTTP_404_NOT_FOUND)
        if all(i.is_full for i in future_class_instances):
            return Response({"details: This class has no not_full future occurrence"},
                            status=status.HTTP_404_NOT_FOUND)
        if len(future_class_instances) == 1 and Enrollment.objects.filter(
                class_instance=future_class_instances[0], user=user):
            return Response({"details: You have already enrolled in this class occurrence"},
                            status=status.HTTP_404_NOT_FOUND)
        if all(Enrollment.objects.filter(class_instance=i, user=user)
               for i in future_class_instances):
            return Response({"details: You have already enrolled in each future occurrences of "
                             "this class"},
                            status=status.HTTP_404_NOT_FOUND)
        enrols = 0
        class_dates = []
        for i in future_class_instances:
            if not i.is_full and not Enrollment.objects.filter(class_instance=i, user=user):
                enrollment = Enrollment(class_instance=i, user=user,
                                        class_start_time=i.start_time)
                enrollment.save()
                i.capacity -= 1
                i.save()
                enrols += 1
                class_dates.append(i.class_date)
        return Response([{'enroll': enrols}, {'class_id': request.GET.get('class_id')},
                         {'class_dates': class_dates}], status=status.HTTP_201_CREATED)


class DropClassView(DestroyAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.GET.get('class_id', '') == '':
            return Response({"details: no class_id para in the request"},
                            status=status.HTTP_400_BAD_REQUEST)
        if request.GET.get('class_date', '') == '':
            return Response({"details: no class_date para in the request"},
                            status=status.HTTP_400_BAD_REQUEST)

        user = Profile.objects.get(user=self.request.user)

        if user and not user.is_subscribed:
            return Response({"details: user isn't an active subscriber"},
                            status=status.HTTP_401_UNAUTHORIZED)
        class_date = request.GET.get('class_date')
        class_obj = Class.objects.filter(id=request.GET.get('class_id'))
        if not class_obj:
            return Response({"details: no such class with this id"},
                            status=status.HTTP_404_NOT_FOUND)
        class_obj = list(class_obj)[0]
        if not Enrollment.objects.filter(user=user):
            return Response({"details: user has no future enrollment"},
                            status=status.HTTP_404_NOT_FOUND)
        user_enrollments = list(Enrollment.objects.filter(user=user))
        class_enrollments = []
        for e in user_enrollments:
            if e.class_instance.belonged_class == class_obj:
                class_enrollments.append(e)
        if class_enrollments == []:
            return Response({"details: user has no future enrollment for this class"},
                            status=status.HTTP_404_NOT_FOUND)

        if class_date == 'all':  # cancel each enrollment in future
            class_instances = [e.class_instance for e in class_enrollments]
            future_class_instances = list(future_instances(class_instances))
            dropped = 0
            class_dates = []
            for e in class_enrollments:
                if e.class_instance in future_class_instances:
                    i = e.class_instance
                    e.delete()
                    i.capacity += 1
                    i.save()
                    dropped += 1
                    class_dates.append(i.class_date)
        else:
            try:
                class_date = datetime.datetime.strptime(request.GET.get('class_date'),
                                                        '%Y-%m-%d').date()
            except ValueError:
                return Response({"details: invalid class_date format. "
                                 "Please enter in the format of %Y-%m-%d"},
                                status=status.HTTP_400_BAD_REQUEST)
            class_instances = ClassInstance.objects.filter(class_date=class_date,
                                                           belonged_class=class_obj)
            future_class_instances = list(future_instances(class_instances))
            class_enrollments = Enrollment.objects.filter(
                class_instance__in=future_class_instances)
            if not class_enrollments:
                return Response({"details: user has no future enrollment for this class on this "
                                 "date"},
                                status=status.HTTP_404_NOT_FOUND)
            dropped = 0
            class_dates = []
            for e in list(class_enrollments):
                i = e.class_instance
                e.delete()
                i.capacity += 1
                i.save()
                dropped += 1
                class_dates.append(i.class_date)

        return Response([{"dropped": dropped}, {'class_id': request.GET.get('class_id')},
                         {'class_dates': class_dates}],
                        status=status.HTTP_200_OK)


class ClassInstancePagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 2


class UserEnrollmentHistoryListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EnrollmentSerializer
    pagination_class = ClassInstancePagination

    def get_queryset(self):
        user = Profile.objects.get(user=self.request.user)
        return Enrollment.objects.filter(user=user).order_by('class_start_time')


class ClassInstancesListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ClassInstanceSerializer
    pagination_class = ClassInstancePagination

    def get_queryset(self):
        if self.request.method == "GET":
            if list(self.request.GET.keys()) == []:  # no search/filter
                id = self.kwargs['studio_id']
                if not Studio.objects.filter(id=id):
                    return Response({"MESSAGE": "Not Found", "STATUS": 404})

                classes = Class.objects.filter(studio_id=id)
                classes_instances = ClassInstance.objects.filter(belonged_class__in=classes)
                return future_instances(classes_instances)
            else:
                # we will get query parameters
                # if any one isn't in allowed search/filter option, return invalid post request too
                keys = list(self.request.GET.keys())
                length = len(keys)
                id = self.kwargs['studio_id']
                if length == 1:  # search has only 1 query
                    method = 'search'
                else:  # filter has more than 1 query
                    method = 'filter'
                if method == 'search':
                    by = keys[0]
                    value = self.request.GET.get(by)
                    by_list = ['class_name', 'coach', 'date', 'time_range']
                    if by in by_list:
                        searched_instances = search(by, value, id)
                        return searched_instances
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                elif method == 'filter':
                    bys = keys
                    by_list = ['class_name', 'coach', 'date', 'time_range']
                    potential_instances = []  # list of queryset
                    for by in bys:
                        if by in by_list:
                            value = self.request.GET.get(by)
                            searched_instances = search(by, value, studio_id=id)
                            potential_instances.append(searched_instances)
                        else:
                            return Response(status=status.HTTP_400_BAD_REQUEST)
                    if potential_instances == []:
                        return Response(status=status.HTTP_404_NOT_FOUND, data=[])
                    intersection_instances = potential_instances[0]
                    for i in range(1, len(potential_instances)):
                        q = potential_instances[i]
                        intersection_instances = intersection_instances.intersection(q)
                    return intersection_instances

                return Response(status=status.HTTP_400_BAD_REQUEST)
