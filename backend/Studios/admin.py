from django.contrib import admin

from .models import Studio, Amenity, Image

# Register your models here.
admin.site.register(Studio)
admin.site.register(Amenity)
admin.site.register(Image)