# Generated by Django 4.2.1 on 2023-05-25 23:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tracker", "0002_alter_classinstance_class_attendance_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="dog",
            name="class_log",
            field=models.TextField(null=True),
        ),
    ]
