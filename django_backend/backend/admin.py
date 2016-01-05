from django.contrib import admin
from backend.models import *

admin.site.register((
    User,
    Chat,
    ChatMessage,
    MovieGenre,
    Movie
))
