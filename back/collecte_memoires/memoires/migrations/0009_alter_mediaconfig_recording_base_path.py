# Generated by Django 4.0.4 on 2022-06-10 09:31

from django.db import migrations, models
import pathlib


class Migration(migrations.Migration):

    dependencies = [
        ('memoires', '0008_alter_mediaconfig_recording_base_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mediaconfig',
            name='recording_base_path',
            field=models.FilePathField(blank=True, default=pathlib.PurePosixPath('/home/mfalce/Documents/03_Pro/1_clients/08_musee_archeologie/application_collecte_memoires/back/collecte_memoires/../../enregistrements'), null=True),
        ),
    ]