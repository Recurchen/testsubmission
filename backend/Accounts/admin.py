from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    fields = ['user','phone_number', 'avatar','payment_method', 'is_subscribed']
    readonly_fields = ['payment_method']
    list_display = ['profile_id','user_id','username', 'first_name', 
    'last_name', 'email', 'phone_number', 'avatar', 'is_subscribed']

    def username(self, obj):
        return obj.user.username
    def email(self, obj):
        return obj.user.email
    def first_name(self, obj):
        return obj.user.first_name
    def last_name(self, obj):
        return obj.user.last_name
    def user_id(self, obj):
        return obj.user.id
    def profile_id(self, obj):
        return obj.id

# Register your models here.
admin.site.register(Profile, ProfileAdmin)