from django.db import models
from django.utils import timezone
from recurrence.fields import RecurrenceField
from Studios.models import Studio
import datetime
from django.contrib.auth.models import User


class Class(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, related_name='classes')
    name = models.CharField(null=False, max_length=100)
    description = models.TextField(null=False, max_length=100)
    coach = models.CharField(null=False, max_length=100)
    capacity = models.PositiveIntegerField(null=False)
    recurrences = RecurrenceField(null=False)
    start_time = models.TimeField(null=False)
    end_time = models.TimeField(null=False)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    all_cancelled = models.BooleanField(default=False)  # cancel all class instances if True
    categories = models.CharField(null=True, blank=True, max_length=200)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Assume we are not creating class in the past, we will only create class in future
        # Assume each class can have only one instance in one day
        # Assume each class instance has same coach and capacity, as class
        super(Class, self).save(*args, **kwargs)
        # update class
        if self.pk:
            start = datetime.datetime.combine(self.start_date, self.start_time)
            end = datetime.datetime.combine(self.end_date, self.end_time)
            instances = list(ClassInstance.objects.filter(belonged_class=self))
            # delete future instances
            now = datetime.datetime.now()
            for i in instances:
                if i.start_time > timezone.now():
                    i.delete()
                else:
                    i.start_time = start
                    i.end_time = end
            # regenerate future instances
            # since we assume max 1 class instance per day
            end = self.end_date + datetime.timedelta(days=1)
            end = datetime.datetime(end.year, end.month, end.day)
            datetimes = self.recurrences.between(now, end, inc=True)
            ex_datetimes = self.recurrences.exdates
            ex_dates = [d.date() for d in ex_datetimes]
            dates = [d.date() for d in datetimes if d.date() not in ex_dates]
            for d in dates:
                if ClassInstance.objects.filter(belonged_class=self, class_date=d):
                    break
                start_time = datetime.datetime.combine(d, self.start_time)
                end_time = datetime.datetime.combine(d, self.end_time)
                ClassInstance.objects.create(
                    belonged_class=self,
                    start_time=start_time,
                    end_time=end_time,
                    class_date=d,
                    capacity=self.capacity
                )
            instances = list(ClassInstance.objects.filter(belonged_class=self))
            if self.all_cancelled:
                for i in instances:
                    i.is_cancelled = True
                    i.save()
            return

            # datetimes = self.recurrences.between(start, end, inc=True)
            # ex_datetimes = self.recurrences.exdates
            # ex_dates = [d.date() for d in ex_datetimes]
            # # new occurrences dates
            # dates = [d.date() for d in datetimes if d not in ex_dates]
            # cancel all class instances

            # all_cancelled = False
            # if len(dates) == 0:
            #     all_cancelled = True
            # if all_cancelled:
            #     for i in instances:
            #         i.is_cancelled = True
            #         i.start_time = datetime.datetime.combine(i.class_date, self.start_time)
            #         i.end_time = datetime.datetime.combine(i.class_date, self.end_time)
            #         i.save()
            #     return

            # dates is not an empty list:
            # if class instance has been cancel but want to de-cancel it.
            # for i in instances:
            #     if i.class_date in dates and i.is_cancelled:
            #         i.is_cancelled = False

            # instances in new time range, need further check for is_cancel status
            # instances_still_in_time_range = []
            # for i in instances:
            #     start_time = datetime.datetime.combine(i.class_date, self.start_time)
            #     end_time = datetime.datetime.combine(i.class_date, self.end_time)
            #     i.start_time = start_time
            #     i.end_time = end_time
            #     # if self update class date range (start date, end date)
            #     if i.class_date < self.start_date or i.class_date > self.end_date:
            #         # since we know max one class instance per day
            #         # i.is_cancelled = True
            #         i.delete()
            #         instances.remove(i)
            #     else:
            #         instances_still_in_time_range.append(i)
            #
            # # we assume one class instance per day and
            # # admin cancel class via setting recurrence with exclude
            # for i in instances_still_in_time_range:
            #     if i.class_date not in dates:  # the instance is excluded
            #         i.is_cancelled = True
            # # check if we need new class instances
            # instance_dates = [i.class_date for i in instances]
            # for d in dates:
            #     if d not in instance_dates:
            #         # create new class instance and save
            #         start_time = datetime.datetime.combine(d, self.start_time)
            #         end_time = datetime.datetime.combine(d, self.end_time)
            #         ClassInstance.objects.create(
            #             belonged_class=self,
            #             start_time=start_time,
            #             end_time=end_time,
            #             class_date=d,
            #             capacity=self.capacity)
            # for i in instances:
            #     i.save()
            # return

        # 2) create Class
        start = datetime.datetime.combine(self.start_date, self.start_time)
        # since we assume max 1 class instance per day
        end = self.end_date + datetime.timedelta(days=1)
        end = datetime.datetime(end.year, end.month, end.day)
        datetimes = self.recurrences.between(start, end, inc=True)
        ex_datetimes = self.recurrences.exdates
        ex_dates = [d.date() for d in ex_datetimes]
        dates = [d.date() for d in datetimes if d.date() not in ex_dates]
        print(dates)
        for d in dates:
            start_time = datetime.datetime.combine(d, self.start_time)
            end_time = datetime.datetime.combine(d, self.end_time)
            ClassInstance.objects.create(
                belonged_class=self,
                start_time=start_time,
                end_time=end_time,
                class_date=d,
                capacity=self.capacity
            )


class ClassInstance(models.Model):
    belonged_class = models.ForeignKey(Class, on_delete=models.CASCADE,
                                       related_name='class_instances')
    is_full = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    start_time = models.DateTimeField(null=False)
    end_time = models.DateTimeField(null=False)
    class_date = models.DateField(null=False)
    capacity = models.PositiveIntegerField(null=False)

    def save(self, *args, **kwargs):
        if self.capacity < 1:
            self.is_full = True
        return super(ClassInstance, self).save(*args, **kwargs)


class Enrollment(models.Model):
    class_instance = models.ForeignKey(ClassInstance, on_delete=models.CASCADE,
                                       related_name='enrollments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    class_start_time = models.DateTimeField(null=False)
    is_cancelled = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.class_start_time = self.class_instance.start_time
        self.is_cancelled = self.class_instance.is_cancelled
        return super(Enrollment, self).save(*args, **kwargs)
