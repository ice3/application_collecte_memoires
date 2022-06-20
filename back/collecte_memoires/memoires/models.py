from django.utils import timezone
from django.db import models
import uuid
from django.utils.text import slugify
import os
from pathlib import Path
from .docx_utils import generate_contract_for_user
from mdeditor.fields import MDTextField


class MediaConfig(models.Model):
    opening_video = models.FileField(
        upload_to="medias",
        blank=True,
        verbose_name="Vidéo de présentation",
        help_text="Sélectionnez la vidéo à afficher à la première étape du questionnaire. De préférence au format webm.",
    )
    closing_picture = models.FileField(
        upload_to="medias",
        blank=True,
        verbose_name="Image de fin (remerciements, sponsors)",
        help_text="Sélectionnez l'image à afficher à la dernière étape du questionnaire",
    )
    recording_base_path = models.FileField(
        null=True,
        blank=True,
        verbose_name="Sélection des chemins des témoignages",
        help_text="Sélectionnez un fichier (peu importe lequel) dans le dossier où seront stockés les médias enregistrés. Il peut se situer n'importe où.",
    )


class ContractConfig(models.Model):
    location = models.TextField(
        blank=True,
        verbose_name="Lieu de captation",
        help_text="Indiquez le lieu à afficher dans les contrats",
    )
    html_contract = MDTextField(
        blank=True,
        verbose_name="Contrat web (en markdown)",
        help_text="Gabarit du contrat de cession des droits (il possède des variables à remplacer en fonction des informations de l'utilisateur). Vous pouvez le formater. Ce contrat n'est utilisé que pour la partie front-end. Le document enregistré est dans un autre fichier.",
    )
    docx_contract = models.FileField(
        blank=True,
        verbose_name="Contrat docx",
        help_text="Gabarit du contrat de cession des droits (il possède des variables à remplacer en fonction des informations de l'utilisateur. Ce fichier est utilisé pour générer les documents contractuels finaux.",
    )


# Create your models here.
class Question(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    text = MDTextField(
        blank=False,
        verbose_name="Texte de la question (avec formatage possible)",
    )
    duration_in_seconds = models.IntegerField(
        default=60, verbose_name="Durée (en seconde) de l'enregistrement"
    )
    start_delay_in_seconds = models.IntegerField(
        default=60,
        verbose_name="Délais (en secondes) avant le début de l'enregistrement",
    )
    order = models.SmallIntegerField(verbose_name="Ordre de la question")
    voiceover = models.FileField(
        upload_to="questions_voiceover",
        blank=True,
        verbose_name="Voix off lisant la question",
    )

    def __str__(self):
        return f"{self.order} - {self.duration_in_seconds}sec - {self.text:.50}"


class Answer(models.Model):
    FORM_TYPE_PAPER = 0
    FORM_TYPE_DIGITAL = 1

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    start_time = models.DateTimeField(auto_now_add=True, blank=True)
    end_time = models.DateTimeField(auto_now_add=True, blank=True)
    terminated = models.BooleanField(default=False)

    user_name = models.CharField(max_length=200, blank=True)
    user_email = models.EmailField(max_length=200, blank=True)
    user_postal_address = models.CharField(max_length=200, blank=True)
    user_phone = models.CharField(max_length=20, blank=True)

    form_type = models.SmallIntegerField(
        choices=((FORM_TYPE_PAPER, "paper"), (FORM_TYPE_DIGITAL, "digital")),
        blank=True,
        null=True,
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
            Path(MediaConfig.objects.first().recording_base_path.path).parent
            / str(timezone.now().date())
            / f"{slugify(self.user_name)}_{uuid.uuid4().hex[:4].upper()}"
        ).resolve()
        os.rename(self.recordings.first().directory_name, new_directory_name)
        print(
            "renaming", self.recordings.first().directory_name, "->", new_directory_name
        )
        self.recordings.update(directory_name=new_directory_name)

    def generate_pdf_contract(self):
        location = ContractConfig.objects.first().location
        date = f"{timezone.now():%m/%d/%Y-%H:%M:%S}"
        directory_name = self.recordings.first().directory_name
        template_path = (
            Path(ContractConfig.objects.first().docx_contract.path)
        ).resolve()
        output_path = Path(directory_name) / "contract.docx"
        generate_contract_for_user(template_path, self, date, location, output_path)

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
        self.generate_informations()
        if self.form_type == self.FORM_TYPE_DIGITAL:
            self.generate_pdf_contract()
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
