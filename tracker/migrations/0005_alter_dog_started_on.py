# Generated by Django 4.2.1 on 2023-05-27 19:01

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tracker", "0004_dog_outing_log"),
    ]

    operations = [
        migrations.AlterField(
            model_name="dog",
            name="started_on",
            field=models.DateField(default=datetime.date.today),
        ),
    ]