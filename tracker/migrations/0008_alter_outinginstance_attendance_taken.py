# Generated by Django 4.2.1 on 2023-06-04 21:52

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tracker", "0007_outinginstance_attendance_taken"),
    ]

    operations = [
        migrations.AlterField(
            model_name="outinginstance",
            name="attendance_taken",
            field=models.BooleanField(null=True),
        ),
    ]