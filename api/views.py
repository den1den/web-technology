from django.conf import settings
from django.shortcuts import render
import os
from django.views.generic import TemplateView

# gets all the template css files and the default template ('')
template_list = [''] + [f[0:-4]
                        for f in os.listdir(settings.SITE_CSS_TEMPLATES)
                        if f.endswith(".css")]


class HomePageView(TemplateView):
    template_name = "api/homepage.html"

    def get_context_data(self, **kwargs):
        # passes the template variables to the view
        context = super(HomePageView, self).get_context_data(**kwargs)
        context['title'] = "Search for a movie"
        context['template_list'] = template_list
        if 'template' in self.kwargs:
            context['template_url'] = settings.SITE_CSS_TEMPLATE_URL + self.kwargs['template'] + '.css'
        return context
