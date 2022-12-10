from rest_framework import serializers
from .models import Plan, Subscription, Payment
from Studios.models import Studio
from Accounts.models import Profile
from Accounts.serializers import PaymentMethodSerializer

class PlanSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Plan
        fields = ['id', 'name', 'description', 'price', 'time_unit', 'time_range','currency']
        required = ['name', 'price', 'time_unit',]


class SubscriptionSerializer(serializers.ModelSerializer):
    # user = serializers.SerializerMethodField()
    # # PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    # plan = PlanSerializer
    
    class Meta:
        model = Subscription
        fields = ['user', 'plan', 'start_time', 'canceled', 'auto_pay',]
        required = ['plan']

    def get_user(self,obj):
        user = Profile.objects.filter(user = serializers.CurrentUserDefault())
        return user

class ViewSubscriptionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.user.username')
    plan_name = serializers.CharField(source='plan.name')
    class Meta:
        model = Subscription
        fields = ['username', 'plan_name', 'start_time', 'canceled', 'auto_pay',]


class PaymentSerializer(serializers.ModelSerializer):
    plan = serializers.CharField(source='subscription.plan')
    price = serializers.DecimalField(source='subscription.plan.price', max_digits=5, decimal_places=2)
    card_num = serializers.CharField(source='payment_method.card_num')
    class Meta:
        model = Payment
        fields = ['user', 'subscription', 'payment_method', 'datetime', 'plan', 'price', 'card_num']