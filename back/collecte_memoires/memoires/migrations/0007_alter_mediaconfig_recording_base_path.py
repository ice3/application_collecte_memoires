# Generated by Django 4.0.4 on 2022-06-10 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memoires', '0006_remove_mediaconfig_closing_picture_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mediaconfig',
            name='recording_base_path',
            field=models.FilePathField(blank=True, null=True),
        ),
    ]
