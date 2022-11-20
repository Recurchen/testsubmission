from django.contrib import admin

from classes.models import Class, ClassInstance, Enrollment


class EnrollmentAdmin(admin.ModelAdmin):
    fields = ['class_instance', 'user', 'is_cancelled', 'class_start_time']
    list_display = ['class_instance', 'user', 'is_cancelled', 'class_start_time']


class ClassAdmin(admin.ModelAdmin):
    fields = ['studio', 'name', 'description', 'coach', 'capacity', 'recurrences',
              'start_time', 'end_time', 'start_date', 'end_date', 'categories']

    list_display = ['name', 'recurrences', 'start_time', 'end_time', 'start_date', 'end_date']


class ClassInstanceAdmin(admin.ModelAdmin):
    fields = ['belonged_class', 'start_time', 'end_time', 'class_date', 'is_full', 'is_cancelled',
              'capacity']
    list_display = ['belonged_class', 'start_time', 'end_time', 'class_date', 'capacity', 'is_full',
                    'is_cancelled']


# Register your models here.
admin.site.register(Class, ClassAdmin)
admin.site.register(ClassInstance, ClassInstanceAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
