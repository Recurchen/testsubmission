# Generated by Django 4.0.1 on 2022-12-06 03:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0003_alter_enrollment_in_future'),
    ]

    operations = [
        migrations.AlterField(
            model_name='enrollment',
            name='in_future',
            field=models.BooleanField(default=True),
        ),
    ]