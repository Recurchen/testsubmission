from tkinter import CASCADE
from django.db import models

# Create your models here.
class Studio(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)

class Amenity(models.Model):
    type = models.CharField(max_length=255)
    quantity = models.IntegerField()
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE, related_name= 'amenities')

class Image(models.Model):
    name = models.CharField(max_length=255)
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE, related_name= 'images')
    image = models.ImageField(upload_to = 'studio/images/')
    
    def __str__(self) -> str:
        return self.name