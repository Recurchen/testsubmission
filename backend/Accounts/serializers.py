from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from .models import Profile, PaymentMethod


class SignUpSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(label=_("Confirm password"), write_only=True, style={"input_type": "password"})
    phone_number = serializers.CharField(source='userprofile.phone_number', required=False)
    avatar = serializers.ImageField(source='userprofile.avatar', required=False)
    is_subscribed = serializers.BooleanField(source='userprofile.is_subscribed', required=False)
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password', 'password2','phone_number', 'avatar', 'is_subscribed')
        required = ['username', 'first_name', 'last_name', 'email', 'password', 'password2',]
        extra_kwargs = {
            'password' : {'write_only': True, "style": {"input_type": "password"}},
        }

    def create(self, validated_data):
        if validated_data.get('password') != validated_data.get('password2'):
            raise serializers.ValidationError({'message': 'password is not match'})
        
        profile_info = validated_data.get('userprofile', None)
        if profile_info is not None:
            phone_num = profile_info.get('phone_number')
            avatar = profile_info.get('avatar')

        user = User.objects.create(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            password=validated_data.get('password')
            #is_subscribed = false by defalut 
        )
        user.set_password(validated_data.get('password'))
        user.save()
        
        if profile_info is not None:
            Profile.objects.create(user=user, phone_number=phone_num, avatar=avatar)
        else:
            Profile.objects.create(user=user)

        return user

class RetrieveUpdateProfileSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='userprofile.phone_number', required=False)
    avatar = serializers.ImageField(source='userprofile.avatar', required=False)
    is_subscribed = serializers.BooleanField(source='userprofile.is_subscribed', required=False)
    class Meta:
        model = get_user_model()
        fields = ["username", "first_name", "last_name", "email", "avatar", "phone_number", "is_subscribed"]
        read_only_fields = ["username"] # cannot modify username
        required = []

    def update(self, instance, validated_data):
        instance.user.first_name = validated_data.get("first_name", instance.user.first_name)
        instance.user.last_name = validated_data.get("last_name", instance.user.last_name)
        instance.user.email = validated_data.get("email", instance.user.email)
        instance.user.save()
        instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.phone_number = validated_data.get("phone_number", instance.phone_number)
        instance.save()
        return instance

class RestrictedProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='userprofile.avatar')
    class Meta:
        model = get_user_model()
        fields = ["username","avatar", "is_subscribed"]
        read_only_fields = ["username","avatar", "is_subscribed"]

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['card_type', 'card_num', 'expired_date', 'cvv', 'billing_address']
        required = ['card_type', 'card_num',]

    def update(self, instance, validated_data):
        instance.card_type = validated_data.get("card_type", instance.card_type)
        instance.card_num = validated_data.get("card_num", instance.card_num)
        instance.expired_date = validated_data.get("expired_date", instance.expired_date)
        instance.cvv = validated_data.get("cvv", instance.cvv)
        instance.billing_address = validated_data.get("billing_address", instance.billing_address)
        instance.save()
        return instance

    def create(self, validated_data):
        pay_method = PaymentMethod.objects.create(
            card_type = validated_data.get("card_type"),
            card_num =  validated_data.get("card_num"),
            expired_date = validated_data.get("expired_date", None),
            cvv = validated_data.get("cvv", None),
            billing_address = validated_data.get("billing_address", None)
        )
        return pay_method