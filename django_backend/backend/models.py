from django.db import models


class User(models.Model):
    username = models.SlugField()


class Movie(models.Model):
    