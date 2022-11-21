from django.db import models
import datetime
from Studios.models import Studio
from Accounts.models import Profile, PaymentMethod
from django.contrib.auth.models import User
from django.db.models import CASCADE, SET_NULL, DO_NOTHING
from django.core.exceptions import ValidationError


def _validate_price(price):
    if price >= 0: # can be equal to zero as there might be some trial plans
        return price
    else:
        raise ValidationError("No Negative Price")

def _validate_time_range(range):
    if 1 <= range <= 6: # allowing 3 months, half a year
        return range
    else:
        raise ValidationError("Invalid Range")

# def _validate_studio(studio):
#     studio = Studio.objects.filter(id=studio)

class Plan(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='plans')
    price = models.DecimalField(max_digits=5, decimal_places=2, validators=[_validate_price])
    
    DAY = 'DAY'
    WEEK = 'WEEK'
    MONTH = 'MON'
    YEAR = 'YEAR'

    TIME_UNIT_CHOICE = [
        (DAY, 'day'),
        (WEEK, 'week'),
        (MONTH, 'month'),
        (YEAR, 'year'),
    ]

    time_unit = models.CharField(max_length=4, choices=TIME_UNIT_CHOICE)
    time_range = models.IntegerField(blank=True, default=1, validators=[_validate_time_range])

    CAD = 'CAD'
    USD = 'USD'

    CURRENCY_CHOICE = [
        (CAD, 'cad'),
        (USD, 'usd')
    ]
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICE, default=CAD)

    def __str__(self):
        return f'{self.name} -- ${self.price} -- {self.time_unit} -- {self.time_range}'


class Subscription(models.Model):
    user = models.ForeignKey(to=Profile, on_delete=CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(to=Plan, on_delete=SET_NULL, related_name='subscriptions', null=True)
    start_time = models.DateTimeField(blank = True, auto_now_add=True)
    canceled = models.BooleanField(blank = True, default=False)
    auto_pay = models.BooleanField(blank = True, default=True)

    def get_end_time(self, time):
        st = time
        # st = datetime.datetime.strptime(time, "%m/%d/%y")
        time_unit = self.plan.time_unit
        time_range = self.plan.time_range
        
        if time_unit == 'DAY':
            time_delta = datetime.timedelta(days = time_range)
        
        elif time_unit == 'WEEK':
            time_delta = datetime.timedelta(days = 7 * time_range)
        
        elif time_unit == 'MON':
            time_delta = datetime.timedelta(days = 31 * time_range)
        
        elif time_unit == 'YEAR':
            time_delta = datetime.timedelta(days = 365 * time_range)

        end_time = st + time_delta

        return end_time
        # return datetime.datetime.strptime(end_time, "%m/%d/%y")


    def cancel(self):
        self.canceled = True
        self.auto_pay = False

    def __str__(self):
        return f'{self.user.user.username} -- {self.plan.name} -- {self.start_time} -- {self.get_end_time()}'

class Payment(models.Model):
    user = models.ForeignKey(to=User, on_delete=CASCADE, related_name='payment')
    subscription = models.ForeignKey(to=Subscription, on_delete=CASCADE, related_name='payment', null=True)
    payment_method = models.ForeignKey(to=PaymentMethod, on_delete=DO_NOTHING, related_name="payment_method")
    datetime = models.DateTimeField()