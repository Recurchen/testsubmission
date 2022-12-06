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

# Register your models here.
admin.site.register(Studio, StudioAdmin)
admin.site.register(Amenity)
admin.site.register(Image)