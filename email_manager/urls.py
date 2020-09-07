#from django.conf.urls import url 
from django.urls import path
from .views import activate_user, password_reset, password_reset_form

app_name = 'email_manager'

urlpatterns = [ 
   #Consult for the back office
    path('activate/<str:uid>/<str:token>/', activate_user),
    path('password-reset/<str:uid>/<str:token>/', password_reset_form),
    path('password-reset/', password_reset , name="password_reset"),
]# -*- coding: utf-8 -*-

