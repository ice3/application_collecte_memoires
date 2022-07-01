from functools import reduce
from pathlib import Path
from django.contrib import admin
from django.http import HttpResponse
from .models import Recording, Answer, Question, ContractConfig, MediaConfig
import csv
from django.db.models import Count


class RecordingInline(admin.TabularInline):
    model = Recording
    extra = 0
    readonly_fields = ["date", "file_name", "directory_name"]


@admin.action(description="Générer un csv des réponses terminées sélectionnées")
def download_answers_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    opts = modeladmin.model._meta
    response["Content-Disposition"] = f"attachment; filename={opts}.csv"
    writer = csv.writer(response)
    queryset = queryset.annotate(number_of_recordings=Count("recordings"))
    fields = [
        "uuid",
        "start_time",
        "end_time",
        "user_name",
        "user_email",
        "user_postal_address",
        "user_phone",
        "form_type",
        "is_contract_generated",
        "recording_type",
        "number_of_recordings",
    ]

    fields_recordings = ["recording_path", "question"]
    extra_headers = []
    for i in range(max([a.number_of_recordings for a in queryset])):
        first, second = fields_recordings
        extra_headers.extend([f"{first}_{i+1}", f"{second}_{i+1}"])
    header_fields = fields.copy()
    header_fields.extend(extra_headers)
    writer.writerow(header_fields)
    for s in queryset:
        if not s.terminated:
            continue
        rows = [getattr(s, field) for field in fields]
        extra_rows = []
        for recording in s.recordings.all():
            path = Path(recording.directory_name, recording.file_name)
            extra_rows.extend(
                [
                    str(path),
                    recording.question.text.replace("\n", " ").replace("\r", ""),
                ]
            )
        rows.extend(extra_rows)
        writer.writerow(rows)
    return response


class AnswerAdmin(admin.ModelAdmin):
    date_hierarchy = "start_time"
    list_display = [
        "start_time",
        "user_name",
        "form_type",
        "terminated",
        "is_contract_generated",
        "uuid",
    ]
    inlines = [
        RecordingInline,
    ]
    actions = [download_answers_csv]


class QuestionAdmin(admin.ModelAdmin):
    list_display = [
        "order",
        "text",
        "duration_in_seconds",
        "start_delay_in_seconds",
        "voiceover",
        "uuid",
    ]


# Register your models here.
admin.site.register(Answer, AnswerAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(ContractConfig)
admin.site.register(MediaConfig)
