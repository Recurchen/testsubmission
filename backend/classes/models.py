from django.db import models
from recurrence.fields import RecurrenceField
from Studios.models import Studio
import datetime


# class Category(models.Model):
#     name = models.CharField(null=False, max_length=100)
#
#     def __str__(self):
#         return self.name


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
    categories = models.CharField(null=True, blank=True, max_length=200)

    # categories = models.ManyToManyField(Category, related_name='classes', blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # 1) update Class
        if self.pk:
            # update self
            start = datetime.datetime.combine(self.start_date, self.start_time)
            end = datetime.datetime.combine(self.end_date, self.start_time)
            self.recurrences.dtstart = start
            self.recurrences.dtend = end
            super(Class, self).save(*args, **kwargs)
            # get all class instances
            instance_ids = ClassInstance.objects.filter(belonged_class=self).values('id')
            instances = [ClassInstance.objects.get(id=instance_ids[i]['id'])
                         for i in range(0, len(instance_ids))]

            # new occurrences:
            datetimes = list(self.recurrences.occurrences())   # this doesn't consider exdates
            dates = []
            for d in datetimes:
                dates.append(d.date())  # convert datetime into date
            ex_datetimes = self.recurrences.exdates
            ex_dates = []
            if len(ex_datetimes) != 0:
                for e in ex_datetimes:
                    ex_dates.append(e.date())  # convert datetime into date
            if len(ex_dates) != 0:
                for d in dates:
                    if d in ex_dates:
                        dates.remove(d)

            # cancel all class instances
            all_cancelled = False
            if len(dates) == 0:
                all_cancelled = True
            if all_cancelled:
                for i in instances:
                    i.is_cancelled = True
                    i.start_time = self.start_time
                    i.end_time = self.end_time
                    i.save()
                return

            # dates is not an empty list:
            # if class instance has been cancel but want to de-cancel it.
            for i in instances:
                if i.class_date in dates and i.is_cancelled:
                    i.is_cancelled = False

            # instances in new time range, need further check for is_cancel status
            instances_still_in_time_range = []
            for i in instances:
                i.start_time = self.start_time
                i.end_time = self.end_time
                # if self update class date range (start date, end date)
                if i.class_date < self.start_date or i.class_date > self.end_date:
                    # i.is_cancelled = True
                    i.delete()
                    instances.remove(i)
                else:
                    instances_still_in_time_range.append(i)

            # we assume one class instance per day and
            # admin cancel class via setting recurrence with exclude
            for i in instances_still_in_time_range:
                if i.class_date not in dates:   # the instance is excluded
                    i.is_cancelled = True
            # check if we need new class instances
            instance_dates = [i.class_date for i in instances]
            for d in dates:
                if d not in instance_dates:
                    # create new class instance and save
                    i = ClassInstance.objects.create(
                        belonged_class=self,
                        start_time=self.start_time,
                        end_time=self.end_time,
                        class_date=d,
                        capacity=self.capacity)
                    i.save()

            for i in instances:
                i.save()
            return

        # 2) create Class
        # not correctly create instances if weekly
        start = datetime.datetime.combine(self.start_date, self.start_time)
        end = datetime.datetime.combine(self.end_date, self.start_time)
        self.recurrences.dtstart = start
        self.recurrences.dtend = end
        super(Class, self).save(*args, **kwargs)
        # create class instances
        datetimes = list(self.recurrences.occurrences())
        dates = []
        for d in datetimes:
            dates.append(d.date())  # convert datetime into date
        ex_datetimes = self.recurrences.exdates
        ex_dates = []
        if len(ex_datetimes) != 0:
            for e in ex_datetimes:
                ex_dates.append(e.date())  # convert datetime into date
        if len(ex_dates) != 0:
            for d in dates:
                if d in ex_dates:
                    dates.remove(d)
        for d in dates:
            ClassInstance.objects.create(
                belonged_class=self,
                start_time=self.start_time,
                end_time=self.end_time,
                class_date=d,
                capacity=self.capacity
            )


class ClassInstance(models.Model):
    belonged_class = models.ForeignKey(Class, on_delete=models.CASCADE,
                                       related_name='class_instances')
    is_full = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    start_time = models.TimeField(null=False)
    end_time = models.TimeField(null=False)
    class_date = models.DateField(null=False)
    capacity = models.PositiveIntegerField(null=False)

    # def save(self, *args, **kwargs):
    #     # if count(registered_user) > capacity:
    #     # self.is_full = True
    #
    #     return super(ClassInstance, self).save(*args, **kwargs)
