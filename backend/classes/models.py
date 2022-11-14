from django.db import models
from recurrence.fields import RecurrenceField
from Studios.models import Studio

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
    categories = models.ManyToManyField(Category, related_name='classes')

    def __str__(self):
        return self.name
