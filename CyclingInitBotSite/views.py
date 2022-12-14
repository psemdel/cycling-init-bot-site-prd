#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr  1 09:37:08 2020

@author: maxime
"""
#django
from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect

# Create your views here.
class HomePageView(TemplateView):
     def get(self, request, **kwargs):
            return render(request, 'CyclingInitBotSite/index.html', context=None)   

def view_404(request, *args, **kwargs):
    return HttpResponseRedirect("home")
