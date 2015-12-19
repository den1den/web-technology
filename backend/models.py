from django.db import models
from django.contrib.auth import models as auth_models


class API(models.Model):
    name = models.CharField(max_length=250)
    url = models.URLField()


class APIObject(models.Model):
    api = models.ForeignKey(API)
    api_id = models.SlugField(max_length=50)


class Genre(APIObject):
    title = models.CharField(max_length=250)


class Movie(APIObject):
    title = models.CharField(max_length=250)
    genres = models.ManyToManyField(Genre)


class MovieList(models.Model):
    name = models.CharField(max_length=250)
    movies = models.ManyToManyField(Movie)


class User(auth_models.User):
    lists = models.ManyToManyField(MovieList)
