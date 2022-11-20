from django.contrib import admin

from classes.models import Class, ClassInstance, Enrollment


class EnrollmentAdmin(admin.ModelAdmin):
    fields = ['class_instance', 'user', 'is_cancelled', 'class_start_time']
    list_display = ['class_ID', 'studio_name', 'class_instance', 'user', 'is_cancelled',
                    'class_start_time']

    def studio_name(self, obj):
        return obj.class_instance.belonged_class.studio.name

    def class_ID(self, obj):
        return obj.class_instance.belonged_class.id


class ClassAdmin(admin.ModelAdmin):
    fields = ['studio', 'name', 'description', 'coach', 'capacity', 'recurrences', 'all_cancelled',
              'start_time', 'end_time', 'start_date', 'end_date', 'categories']

    list_display = ['class_ID', 'studio_id', 'name', 'coach', 'recurrences_rule', 'all_cancelled',
                    'start_time', 'end_time', 'start_date', 'end_date', 'categories']

    def recurrences_rule(self, obj):
        text_rules_inclusion = []
        for rule in obj.recurrences.rrules:
            text_rules_inclusion.append(rule.to_text())
        return text_rules_inclusion

    def studio_id(self, obj):
        return obj.studio.id

    def class_ID(self, obj):
        return obj.id


class ClassInstanceAdmin(admin.ModelAdmin):

    fields = ['belonged_class', 'start_time', 'end_time', 'class_date', 'is_full', 'is_cancelled',
              'capacity']
    list_display = ['class_instance_id', 'class_ID', 'class_name', 'coach', 'start_time',
                    'end_time', 'class_date', 'capacity', 'is_full', 'is_cancelled',
                    'current_enrollments']

    def current_enrollments(self, obj):
        return len(list(Enrollment.objects.filter(class_instance=obj)))

    def coach(self, obj):
        return obj.belonged_class.coach

    def class_ID(self, obj):
        return obj.belonged_class.id

    def class_name(self, obj):
        return obj.belonged_class.name

    def class_instance_id(self, obj):
        return obj.id


# Register your models here.
admin.site.register(Class, ClassAdmin)
admin.site.register(ClassInstance, ClassInstanceAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
