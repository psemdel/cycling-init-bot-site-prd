#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr  1 10:19:45 2020

@author: maxime
"""
from bot_requests.models import BotRequest    
from django.contrib.auth.models import User           
from django.utils import timezone 

def parse_json():
    return 1
    
def parse_request_text(request_text):
    return 1
    
    
def create_parse_request(request_text):
    #Json
    request_array=request_text.split("&")
    
    author_name=request_array[0]
    try:
       this_author=User.objects.get(username=author_name)
    except:
       print("user not found")
       return 1
   
    parsed_request=parse_request_text(request_text)
    
    rq=BotRequest(
            author=this_author,
            entry_time=timezone.now(),
            routine=request_array[1],
            item_id=request_array[2],
            parsed_request
            )
            

    
    
if __name__ == '__main__':