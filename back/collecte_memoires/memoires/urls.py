from django.urls import path

from . import views

urlpatterns = [
    path("questions/", views.get_all_questions),
    path("contract-config/", views.get_contract_config),
    path("new-memory/", views.new_memory),
    path("<uuid:answer_uuid>/audio-video/", views.set_audio_or_video),
    path(
        "<uuid:answer_uuid>/questions/<uuid:question_uuid>/", views.answer_to_question
    ),
    path("<uuid:answer_uuid>/user-infos/", views.user_infos),
    path("<uuid:answer_uuid>/user-signature/", views.user_signature),
    path("<uuid:answer_uuid>/terminate/", views.terminate_memory),
]
