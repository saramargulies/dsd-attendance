# Generated by Django 4.2.1 on 2023-06-11 07:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("tracker", "0013_dog_pvt_avail_dog_pvt_count_dog_pvt_log_pvtpackage_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="pvtpackage",
            name="dog",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="dog",
                to="tracker.dog",
            ),
        ),
    ]
