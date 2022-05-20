import json
from re import I
from django.shortcuts import render, get_object_or_404
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone

from .models import Answer, Question, Recording
from django.conf import settings

# Create your views here.
def get_all_questions(request):
    questions = Question.objects.all().order_by("order")
    return JsonResponse({"questions": serializers.serialize("json", questions)})


@require_POST
@csrf_exempt
def new_memory(request):
    answer = Answer.objects.create()
    return JsonResponse({"uuid": answer.uuid})


@require_POST
@csrf_exempt
def answer_to_question(request, answer_uuid, question_uuid):
    question = get_object_or_404(Question, uuid=question_uuid)
    answer = get_object_or_404(Answer, uuid=answer_uuid)
    date = timezone.now().date()
    folder_name = settings.BASE_MEDIAS / str(date) / str(answer_uuid)
    folder_name.mkdir(exist_ok=True, parents=True)
    extension = "webm"
    file_name = f"question-{question.order}.{extension}"
    path = folder_name / file_name
    print("creating", path)
    recording_type = None

    if request.FILES["media"].content_type == "video/webm":
        recording_type = Recording.RECORDING_TYPE_VIDEO
    elif request.FILES["media"].content_type == "audio/webm":
        recording_type = Recording.RECORDING_TYPE_AUDIO
    else:
        print("AAAAAAAAAA", "unknown content type", request.FILES["media"].content_type)

    with open(path, "wb+") as f:
        for chunk in request.FILES.get("media").chunks():
            f.write(chunk)  # so, just read it from the request

    Recording.objects.create(
        recording_type=recording_type,
        directory_name=folder_name,
        file_name=file_name,
        answer=answer,
        question=question,
    )
    return JsonResponse({"status": "ok"})


@require_POST
@csrf_exempt
def set_audio_or_video(request, answer_uuid):
    json_data = json.loads(request.body)
    answer = get_object_or_404(Answer, uuid=answer_uuid)
    answer.set_recording_type(json_data["video"])
    return JsonResponse({"status": "ok"})


@require_POST
@csrf_exempt
def user_infos(request, answer_uuid):
    answer = get_object_or_404(Answer, uuid=answer_uuid)
    answer.user_email = request.POST.get("user_email")
    answer.user_name = request.POST.get("user_name")
    answer.user_postal_address = request.POST.get("user_postal_address")
    answer.user_phone = request.POST.get("user_phone")

    is_digital = request.POST.get("isDigital") == "true"
    answer.set_form_type(is_digital, save=True)
    return JsonResponse({"status": "ok"})


@require_POST
@csrf_exempt
def user_signature(request, answer_uuid):
    answer = get_object_or_404(Answer, uuid=answer_uuid)
    answer.signature = request.POST.get("signature")
    answer.accepted_terms_datetime = timezone.now()
    answer.save()
    return JsonResponse({"status": "ok"})


@require_POST
@csrf_exempt
def terminate_memory(request, answer_uuid):
    answer = get_object_or_404(Answer, uuid=answer_uuid)
    answer.terminate()
    return JsonResponse({"status": "ok"})

