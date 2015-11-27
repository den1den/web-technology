from django.conf.urls import include, url, patterns
from api import views

urlpatterns = patterns('',
    url(r'', views.HomePageView.as_view()),
)