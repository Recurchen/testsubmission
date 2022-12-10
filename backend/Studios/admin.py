from django.contrib import admin

from .models import Studio, Amenity, Image

class StudioAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'number']

    def name(self, obj):
        return obj.name

    def address(self, obj):
        return obj.address

    def number(self, obj):
        return obj.phone_number

class AmenityAdmin(admin.ModelAdmin):
    list_display = ['Type', 'Quantity', 'Belong_To']

    def Type(self, obj):
        return obj.type

    def Quantity(self, obj):
        return obj.quantity

    def Belong_To(self, obj):
        return obj.studio.name

# Register your models here.
admin.site.register(Studio, StudioAdmin)
admin.site.register(Amenity, AmenityAdmin)
admin.site.register(Image)