# Generated by Django 4.0.4 on 2022-06-10 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memoires', '0012_alter_mediaconfig_recording_base_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mediaconfig',
            name='recording_base_path',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]