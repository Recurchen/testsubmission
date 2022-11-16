from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from .models import Profile


class SignUpSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(label=_("Confirm password"), write_only=True, style={"input_type": "password"})
    phone_number = serializers.CharField(source='userprofile.phone_number')
    class Meta:
        model = User
        # fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password', 'password2')
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password', 'password2','phone_number')
        extra_kwargs = {
            'password' : {'write_only': True, "style": {"input_type": "password"}},
        }

    def create(self, validated_data):
        print(validated_data)
        phone_num = validated_data.get('userprofile').get('phone_number')

        user = User.objects.create(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            password=validated_data.get('password')
        )
        user.set_password(validated_data.get('password'))
        user.save()

        Profile.objects.create(user=user, phone_number=phone_num)
        return user

