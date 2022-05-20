from django.utils import timezone
from django.db import models
import uuid
from django.conf import settings


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

    def terminate(self):
        self.terminated = True
        self.end_time = timezone.now()
        self.save()


class Recording(models.Model):
    RECORDING_TYPE_VIDEO = 0
    RECORDING_TYPE_AUDIO = 1

    date = models.DateTimeField(auto_now_add=True, blank=True)
    path_to_media = models.CharField(max_length=250, null=True, editable=False)
    recording_type = models.SmallIntegerField(
        choices=((RECORDING_TYPE_VIDEO, "video"), (RECORDING_TYPE_AUDIO, "audio"))
    )
    answer = models.ForeignKey(
        to=Answer, on_delete=models.CASCADE, related_name="recordings"
    )
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="recordings"
    )

