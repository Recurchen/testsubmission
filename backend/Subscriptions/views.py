from datetime import datetime
from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from .serializers import PlanSerializer, SubscriptionSerializer
from django.contrib.auth.models import User
from .models import Plan, Subscription, Payment
from .permissions import IsSelfOrAdmin
from Accounts.models import Profile
from datetime import timedelta

import schedule
import time

END_DELTA = timedelta(days=366)

def _set_auto_payment(subscription):
    print("called1")
    start_time = subscription.start_time
    end_time = subscription.get_end_time(start_time)
    duration = (end_time - start_time).total_seconds()
    
    schedule.every(duration).seconds.do(_update_sub_make_pay, subscription=subscription)

def _update_sub_make_pay(subscription):
    print("called")
    initial_end = subscription.get_end_time(subscription.starttime)
    user = subscription.user
    payment_method = user.payment_method
    if payment_method is None or subscription.auto_pay == False:
        try:
            payments = Payment.objects.filter(subscription=subscription)
            for payment in payments:
                if payment.datetimes > initial_end:
                    payment.delete()
        except Payment.DoesNotExist:
            res = {"message":"you've reached the end"}
            return Response(res, status=status.HTTP_200_OK)
        subscription.canceled = True
        subscription.auto_pay = False
        subscription.save()
        return False # declined as no payment method
    else:
        subscription.start_time = initial_end
        subscription.save()
        return True

def _make_payment(subscription):
    user = subscription.user
    payment_method = user.payment_method
    if payment_method is None:
        subscription.canceled = True
        subscription.auto_pay = False
        subscription.save()
        return False # declined as no payment method
    else:
        Payment.objects.create(user=user.user, subscription=subscription, 
                                payment_method=payment_method, datetime=datetime.utcnow())
        return True

def _make_future_payment(subscription):
    final_end = subscription.start_time + END_DELTA
    curr = subscription.get_end_time(subscription.start_time)
    user = subscription.user
    payment_method = user.payment_method
    while curr < final_end:
        payment = Payment.objects.create(user=user.user, subscription=subscription, 
                                            payment_method=payment_method, datetime=curr)
        payment.save()
        curr = subscription.get_end_time(curr)


class PlansView(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = PlanSerializer

    def get_queryset(self):
        return Plan.objects.all()

class CreateSubView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]
    serializer_class = SubscriptionSerializer

    def post(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs['user_id'])
        self.check_object_permissions(request, user)

        try:
            profile = Profile.objects.get(user=user)
            plan = Plan.objects.get(id=request.data['plan'])
        except Plan.DoesNotExist:
            res = {"message":"Sorry! the plan you enter is invalid"}
            return Response(res, status=status.HTTP_404_NOT_FOUND)

        sub = Subscription.objects.create(user=profile, plan = plan)
        paid = _make_payment(sub)

        if paid:
            _make_future_payment(sub)
            _set_auto_payment(sub)
            res = {"message":"success! enjoy your time in our gym"}
            return Response(res, status=status.HTTP_200_OK)
        
        else:
            res = {"message":"oops! subscription is canceled as no recorded payment method"}
            return Response(res, status=status.HTTP_400_BAD_REQUEST)

        # return super().post(request, *args, **kwargs)

class CancelSubView(APIView):
    pass