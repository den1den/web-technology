from django.db import models


class User(models.Model):
    username = models.SlugField()

    def __str__(self):
        return self.username


class MovieGenre(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name


class Movie(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=128)
    genres = models.ManyToManyField(MovieGenre, blank=True)

    def __str__(self):
        return self.name


class Chat(models.Model):
    creator = models.ForeignKey(User)
    movie = models.ForeignKey(Movie, blank=True, null=True)
    name = models.CharField(max_length=128)
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('movie', 'name')

    def __str__(self):
        return self.name


class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat)
    user = models.ForeignKey(User)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '(%s) %s [$s]: %s' % (self.chat, self.user, self.timestamp, self.text)
