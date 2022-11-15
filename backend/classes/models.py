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
        # 1) update
        if self.pk:
            super(Class, self).save(*args, **kwargs)
            instance_ids = ClassInstance.objects.filter(belonged_class=self).values('id')
            # all class instances belonged to self
            instances = [ClassInstance.objects.get(id=instance_ids[i]['id'])
                         for i in range(0, len(instance_ids))]
            for i in instances:
                # if self update class time
                i.start_time = self.start_time
                i.end_time = self.end_time
                # if self update class date range (start date, end date)

                i.save()

            return

        # 2) create Class
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

    def save(self, *args, **kwargs):
        if not self.capacity > 0:
            self.is_full = True
        return super(ClassInstance, self).save(*args, **kwargs)
