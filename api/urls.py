from django.conf.urls import include, url, patterns
from api import views

urlpatterns = patterns('',
    url(r'^$', views.HomePageView.as_view()),
    url(r'^(?P<template>[\w-]+)$', views.HomePageView.as_view()),
)