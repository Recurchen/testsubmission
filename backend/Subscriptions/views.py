from datetime import datetime
from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .serializers import PlanSerializer, SubscriptionSerializer, PaymentSerializer, ViewSubscriptionSerializer
from django.contrib.auth.models import User
from .models import Plan, Subscription, Payment
from .permissions import IsSelfOrAdmin
from Accounts.models import Profile
from datetime import timedelta
from classes.views import drop_class_after
from django.utils import timezone

END_DELTA = timedelta(days=366)

def update_sub_make_pay(subscription):
    st = subscription.start_time
    initial_end = subscription.get_end_time(st)
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
        danjgo_user = user.user
        past_payment = Payment.objects.filter(user=danjgo_user)
        for payment in past_payment: # skip if current month is already paid
            if payment.datetime.year == subscription.start_time.year and payment.datetime.month == subscription.start_time.month:
                return True
        Payment.objects.create(user=user.user, subscription=subscription, 
                                payment_method=payment_method, datetime=subscription.start_time)
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

# def cancel_future_payments(subscription):
#     future_payments = Payment.objects.filter(subscription=subscription)
#     now = timezone.now()
#     for payment in future_payments:
#         if payment.datetime > now:
#             payment.delete()
#             payment.save()

def update_future_payments(subscription, payment_method):
    future_payments = Payment.objects.filter(subscription=subscription)
    now = timezone.now()
    for payment in future_payments:
        if payment.datetime > now:
            payment.payment_method = payment_method
            payment.save()

class PlansPagination(PageNumberPagination):
    page_size = 3

class PlansView(ListAPIView):
    permission_classes = [AllowAny,]
    serializer_class = PlanSerializer
    pagination_class = PlansPagination

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

        dt = datetime.now()
        past_sub = Subscription.objects.filter(user=profile).order_by('-start_time').first()
        if past_sub is not None:
            if past_sub.start_time.year == datetime.now().year and past_sub.start_time.month == datetime.now().month:
                    dt = (dt.replace(day=1) + datetime.timedelta(days=32)).replace(day=1)
        sub = Subscription.objects.create(user=profile, plan = plan, start_time = dt)
        paid = _make_payment(sub)

        if paid:
            _make_future_payment(sub)
            profile.is_subscribed=True
            profile.save()
            res = {"message":"success! enjoy your time in our gym"}
            return Response(res, status=status.HTTP_200_OK)
        
        else:
            res = {"message":"oops! subscription is canceled as no recorded payment method"}
            return Response(res, status=status.HTTP_400_BAD_REQUEST)

class UpdateSubView(APIView):
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]
    serializer_class = SubscriptionSerializer

    def post(self, request, *args, **kwargs): #actually create a new sub
        user = get_object_or_404(User, pk=kwargs['user_id'])
        self.check_object_permissions(request, user)

        try:
            profile = Profile.objects.get(user=user)
            sub = Subscription.objects.filter(user=profile).order_by('-start_time').first()
        except Subscription.DoesNotExist:
            msg = {"message": "Sorry, you're not subscribed yet!"}
            return Response(msg, status=status.HTTP_404_NOT_FOUND)

        try:
            new_plan = Plan.objects.get(id=request.data['plan'])
            if not sub.canceled:
                ori_plan = sub.plan
                if new_plan.id == ori_plan.id:
                    res = {"message":"You've already subscriped this plan"}
                    return Response(res, status=status.HTTP_200_OK)
        except Plan.DoesNotExist:
            res = {"message":"Sorry! the plan you enter is invalid"}
            return Response(res, status=status.HTTP_404_NOT_FOUND)
        
        # sub.plan = new_plan
        # sub.save()
        
        # cancel_future_payments(sub)
        future_payments = Payment.objects.filter(subscription=sub)
        now = timezone.now()
        for payment in future_payments:
            if payment.datetime > now:
                payment.delete()       
 
        print(sub.plan)
        
        dt = sub.get_end_time(sub.start_time)
        print(dt)
        new_sub = Subscription.objects.create(user=profile, plan = new_plan, start_time=dt) # validify in next month
        paid = _make_payment(new_sub)
        print(new_sub.plan)

        if paid:
            _make_future_payment(new_sub)
            res = {"message":"success! Your plan is already changed, enjoy!"}
            return Response(res, status=status.HTTP_200_OK)
        else:
            res = {"message":"oops! updating failed as no recoreded payment method."}
            return Response(res, status=status.HTTP_400_BAD_REQUEST)        

class CancelSubView(APIView):
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]
    serializer_class = SubscriptionSerializer
    
    def post(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs['user_id'])
        self.check_object_permissions(request, user)

        try:
            profile = Profile.objects.get(user=user)
            sub = Subscription.objects.filter(user=profile).order_by('-start_time').first()
            current_end_time = sub.get_end_time(sub.start_time)
            sub.cancel()
            sub.save()
            profile.is_subscribed = False
            profile.save()

            future_payments = Payment.objects.filter(subscription=sub)
            now = timezone.now()
            for payment in future_payments:
                if payment.datetime > now:
                    payment.delete()
        
            drop_class_after(current_end_time, user)

            res = {"message":"your subscription is canceled"}
            return Response(res, status=status.HTTP_200_OK)

        except (Profile.DoesNotExist, Subscription.DoesNotExist, Payment.DoesNotExist):
            res = {"message":"Sorry! some thing is wrong"}
            return Response(res, status=status.HTTP_404_NOT_FOUND)


class RetriveSubView(APIView):
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]
    serializer_class = SubscriptionSerializer
    # lookup_field = 'user_id'

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs['user_id'])
        print(user)
        profile = Profile.objects.get(user=user)
        print(profile)
        self.check_object_permissions(request, user)
        queryset = Subscription.objects.filter(user=profile.id).order_by('-start_time').first()
        print(queryset)
        serializer = ViewSubscriptionSerializer(queryset)
        # serializer.is_valid()
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentPagination(PageNumberPagination):
    page_size = 3

class PastPaymentView(ListAPIView):
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]
    serializer_class = PaymentSerializer
    pagination_class = PaymentPagination
    model = Payment
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = get_object_or_404(User, pk=user_id)
        self.check_object_permissions(self.request, user)
        queryset = self.model.objects.filter(user=user_id)
        pastPayments = queryset.exclude(datetime__gte = datetime.now())
        return pastPayments.order_by('datetime')

class FuturePaymentView(ListAPIView):
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]
    serializer_class = PaymentSerializer
    pagination_class = PaymentPagination
    model = Payment
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = get_object_or_404(User, pk=user_id)
        self.check_object_permissions(self.request, user)
        queryset = self.model.objects.filter(user=user_id)
        futurePayments = queryset.exclude(datetime__lte = datetime.now())
        return futurePayments.order_by('datetime')