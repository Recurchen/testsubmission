from django.db import models
from django.contrib.auth.models import User
from phone_field import PhoneField

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='userprofile', on_delete=models.CASCADE)
    phone_number = PhoneField(blank=True, help_text='Contact phone number')
    avatar = models.ImageField(blank=True, null=True, upload_to="images/profile")
    # todo: subscription
    # todo: payment method 