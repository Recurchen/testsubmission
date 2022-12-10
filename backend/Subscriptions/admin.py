from django.contrib import admin
from .models import Plan, Subscription

class PlanAdmin(admin.ModelAdmin):
    list_display = ['plan_ID','name', 'price']

    def plan_ID(self, obj):
        return obj.id

class SubscriptionAdmin(admin.ModelAdmin):
    fields = ['username', 'plan', 'start_time', 'canceled', 'auto_pay']
    list_display = ['Subscription_ID','username', 'plan', 'start_time', 'canceled', 'auto_pay']

    def Subscription_ID(self, obj):
        return obj.id

    def plan(self, obj):
        return obj.plan.name

    def username(self, obj):
        return obj.user.user.username

# Register your models here.
admin.site.register(Plan, PlanAdmin)
admin.site.register(Subscription, SubscriptionAdmin)