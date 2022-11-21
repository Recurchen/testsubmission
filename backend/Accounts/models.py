from django.db import models
from django.contrib.auth.models import User
from phone_field import PhoneField
from django.db.models import SET_NULL

class PaymentMethod(models.Model):
    CREDIT = 'Credit Card'
    DEBIT = 'Debit Card'
    CARD_TYPE_CHOICE = [
        (CREDIT, 'Credit Card'),
        (DEBIT, 'Debit Card'),
    ]

    card_type = models.CharField(max_length=20, choices=CARD_TYPE_CHOICE)
    card_num = models.CharField(max_length=16)
    expired_date = models.DateField(blank=True, null=True)
    cvv = models.CharField(max_length=4, blank=True, null=True)
    billing_address = models.CharField(max_length=1024, blank=True, null=True)

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='userprofile', on_delete=models.CASCADE)
    phone_number = PhoneField(blank=True, null=True, help_text='Contact phone number')
    avatar = models.ImageField(blank=True, null=True, upload_to="images/profile")
    payment_method = models.ForeignKey(to=PaymentMethod, on_delete=SET_NULL, 
                                        related_name="profile", blank=True, null=True)
    is_subscribed = models.BooleanField(null=True, default=False)