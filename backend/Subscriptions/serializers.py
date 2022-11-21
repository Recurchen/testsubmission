from rest_framework import serializers
from .models import Plan, Subscription, Payment
from Studios.models import Studio
from Accounts.models import Profile

class PlanSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Plan
        fields = ['name', 'description', 'studio', 'price', 'time_unit', 'time_range','currency']
        required = ['name', 'studio', 'price', 'time_unit',]


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
    
    # def create(self, validated_data):
    #     # plan = Plan.objects.filter(val)
    #     sub = Subscription.objects.create(
    #         user = self.user, 
    #         plan_id = validated_data.get("plan"))

    #     return sub

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['user', 'subscription', 'payment_method', 'datetime']