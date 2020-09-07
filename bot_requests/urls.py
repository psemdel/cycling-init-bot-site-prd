#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar 30 17:39:43 2020

@author: maxime
"""

#from django.conf.urls import url 
from bot_requests import views 
from django.urls import path
from .models import *

app_name = 'botrequests'

urlpatterns = [ 
    path('', views.index, name='index'),
   #Consult for the back office
    path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    path('run/', views.run, name='run'),
    path('delete/<str:routine>/<int:pk>', views.delete_rq),
    path('get/<str:routine>/<int:userid>', views.get_request_list),
    path('all/<str:routine>/<int:userid>', views.all_get_request_list),
    path('create/<str:routine>/', views.create_rq),
    path('create_file/<str:routine>/', views.create_file_rq),
]