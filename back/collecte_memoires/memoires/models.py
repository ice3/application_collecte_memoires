from django.utils import timezone
from django.db import models
import uuid
from django.conf import settings
from django.utils.text import slugify
import os
from pathlib import Path
from .docx_utils import generate_contract_for_user

# import image_utils

# Create your models here.
class Question(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    text = models.TextField(blank=False)
    duration_in_seconds = models.IntegerField(default=60)
    order = models.SmallIntegerField()

    def __str__(self):
        return f"{self.order} - {self.duration_in_seconds}sec - {self.text:.50}"


class Answer(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    start_time = models.DateTimeField(auto_now_add=True, blank=True)
    end_time = models.DateTimeField(auto_now_add=True, blank=True)
    terminated = models.BooleanField(default=False)

    user_name = models.CharField(max_length=200, blank=True)
    user_email = models.EmailField(max_length=200, blank=True)
    user_postal_address = models.CharField(max_length=200, blank=True)
    user_phone = models.CharField(max_length=20, blank=True)

    form_type = models.SmallIntegerField(
        choices=((0, "paper"), (1, "digital")), blank=True, null=True
    )
    accepted_terms_datetime = models.DateTimeField(blank=True, null=True)
    signature = models.TextField()  # stores the base64 image

    recording_type = models.SmallIntegerField(
        choices=((0, "video"), (1, "audio")), blank=True, null=True
    )

    def __str__(self):
        return f"{self.uuid}"

    def set_recording_type(self, is_video):
        if is_video:
            self.recording_type = 0
        else:
            self.recording_type = 1
        self.save()

    def set_form_type(self, is_digital, save=True):
        if is_digital:
            self.form_type = 1
        else:
            self.form_type = 0

        if save:
            self.save()

    def rename_captures_folder(self):
        new_directory_name = (
            settings.BASE_MEDIAS
            / str(timezone.now().date())
            / f"{slugify(self.user_name)}_{uuid.uuid4().hex[:4].upper()}"
        )
        os.rename(self.recordings.first().directory_name, new_directory_name)
        self.recordings.update(directory_name=new_directory_name)

    def generate_pdf_contract(self):
        directory_name = self.recordings.first().directory_name
        template_path = (
            Path(settings.BASE_DIR)
            / ".."
            / ".."
            / "documents"
            / "template_contrat.docx"
        ).resolve()
        output_path = Path(directory_name) / "contract.docx"
        generate_contract_for_user(
            template_path, self, "12 mai 20221", "Lille", output_path
        )

    def generate_informations(self):
        """Generate a 'readme' with all the informations"""
        directory_name = self.recordings.first().directory_name
        template = f"""
Mémoires ({self.get_recording_type_display()}) capturées entre {self.start_time:%m/%d/%Y-%H:%M:%S} et {self.end_time:%m/%d/%Y-%H:%M:%S}.
----------
Type de formulaire : {self.get_form_type_display()}. 
Nom du témoin : {self.user_name}
Email du témoin : {self.user_email}
Adresse du témoin : {self.user_postal_address}
Téléphone du témoin : {self.user_phone}
----------"""
        for recording in self.recordings.all():
            template += f"""
Question : {recording.question.text}
Le : {recording.date:%m/%d/%Y-%H:%M:%S}
Fichier : {recording.file_name}
            """
        open(Path(directory_name) / "informations.txt", "w").write(template)

    def terminate(self):
        self.terminated = True
        self.end_time = timezone.now()

        self.rename_captures_folder()
        self.generate_pdf_contract()
        self.generate_informations()
        self.save()


class Recording(models.Model):
    RECORDING_TYPE_VIDEO = 0
    RECORDING_TYPE_AUDIO = 1

    date = models.DateTimeField(auto_now_add=True, blank=True)
    directory_name = models.CharField(max_length=250, null=True, editable=False)
    file_name = models.CharField(max_length=250, null=True, editable=False)
    recording_type = models.SmallIntegerField(
        choices=((RECORDING_TYPE_VIDEO, "video"), (RECORDING_TYPE_AUDIO, "audio"))
    )
    answer = models.ForeignKey(
        to=Answer, on_delete=models.CASCADE, related_name="recordings"
    )
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="recordings"
    )
