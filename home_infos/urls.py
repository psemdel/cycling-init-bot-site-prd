# -*- coding: utf-8 -*-

#from django.conf.urls import url 
from home_infos import views 
from django.urls import path
from .models import *

app_name = 'home_infos'

urlpatterns = [ 
    path('', views.get_news),
]