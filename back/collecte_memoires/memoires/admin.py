from django.contrib import admin
from .models import Recording, Answer, Question

# Register your models here.
admin.site.register(Answer)
admin.site.register(Recording)
admin.site.register(Question)
