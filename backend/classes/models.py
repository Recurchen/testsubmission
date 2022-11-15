from django.db import models
from recurrence.fields import RecurrenceField
from Studios.models import Studio
import datetime


class Category(models.Model):
    name = models.CharField(null=False, max_length=100)

    def __str__(self):
        return self.name


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

    # categories = models.CharField(null=True, max_length=200)
    # categories = models.ManyToManyField(Category, related_name='classes', blank=True)

    def __str__(self):
        start = datetime.datetime.combine(
            self.start_date, self.start_time).strftime("%Y/%m/%d, %H:%M:%S"),
        end = datetime.datetime.combine(
            self.end_date, self.end_time).strftime("%Y/%m/%d, %H:%M:%S"),
        return self.name + "  start: " + str(start) + "end: " + str(end)

    def save(self, *args, **kwargs):
        # TODO:update
        if self.pk:
            return super(Class, self).save(*args, **kwargs)

        # create all instances of class
        # TODO: check if already has class instances?
        # 1) if 11-1 to 11-2, then has 3 instances: 11-1to11-2, 11-1,11-2
        # 2) if 11-1to11-1, then only 1 instances: 11-1

        start = datetime.datetime.combine(self.start_date, self.start_time)
        # end = datetime.datetime.combine(self.end_date, self.end_time)
        end = datetime.datetime.combine(self.end_date, self.start_time)
        self.recurrences.dtstart = start
        self.recurrences.dtend = end
        super(Class, self).save(*args, **kwargs)

        # TODO:why empty?
        # so far can't make all instances have categories
        # category_ids = self.categories.values('id')
        # print(category_ids)

        # datetimes = self.recurrences.between(start, end, inc=True)
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

        if len(dates) == 1:
            return
        # TODO:only 1 occurences but is excluded by exdats??
        # if len(dates) == 0:
        #     return

        for d in dates:
            # TODO: should I stick with current or go back to use objects.create()???
            # c = Class.objects.create(
            c = Class(
                studio=self.studio,
                name=self.name,
                description=self.description,
                coach=self.coach,
                capacity=self.capacity,
                recurrences=self.recurrences,
                start_time=self.start_time,
                end_time=self.end_time,
                start_date=d,
                end_date=d
            )

            # for i in range(0, len(category_ids)):
            #     category = Category.objects.get(category_ids[i]['id'])
            #     c.categories.add(category)
            super(Class, c).save(*args, **kwargs)
