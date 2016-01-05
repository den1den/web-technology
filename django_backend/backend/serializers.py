from rest_framework import serializers
from backend.models import *


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username')


class ChatSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Chat
        fields = ('url', 'creator', 'movie', 'name', 'timestamp')


class ChatMessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ('url', 'chat', 'user', 'text', 'timestamp')


class MovieGenreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MovieGenre
        fields = ('url', 'id', 'name')


class MovieSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Movie
        fields = ('url', 'id', 'name', 'genres')
