# Generated by Django 4.2.1 on 2023-06-09 03:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tracker", "0011_outinginstance_address"),
    ]

    operations = [
        migrations.AddField(
            model_name="notes",
            name="date_added",
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name="notes",
            name="is_completed",
            field=models.BooleanField(default=False),
        ),
    ]