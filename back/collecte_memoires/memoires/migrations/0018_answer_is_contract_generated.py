# Generated by Django 4.0.4 on 2022-07-01 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memoires', '0017_mediaconfig_background_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='is_contract_generated',
            field=models.BooleanField(default=False),
        ),
    ]