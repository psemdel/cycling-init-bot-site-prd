#django
from django.shortcuts import render
from django.contrib.auth.models import User
from django.urls import reverse
from django.http.response import JsonResponse, HttpResponse
from django.conf import settings

from django.core.mail import send_mail
# rest
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.decorators import permission_classes, api_view

import requests

def djoser_getpost(key_path, payload):
    BASE_URL=settings.URL_ROOT+reverse("api-root") +"users/"
    
    rq_url=BASE_URL + key_path + "/"
    response = requests.post(rq_url, data = payload)
    
    if response.status_code == 204:
         return HttpResponse("<h1>" + key_path +" successful!</h1><br><a href='https://cycling-init-bot.toolforge.org/home'>Cycling-Init-Bot</a>")
    else:
         return HttpResponse("Something went wrong!")

def password_reset_form(request, uid, token):
    context = {
        'uid': uid,
        'token': token
    }
    return render(request,'email_manager/password_reset.html', context)

#work form output
def password_reset(request):
     if request.method == 'POST':
         if request.POST['new_password']!=request.POST['re_new_password']:
             return HttpResponse("Given passwords are not identical")
         else:
             new_password=request.POST['new_password']
             re_new_password=request.POST['re_new_password']
             uid=request.POST['uid']
             token=request.POST['token']
             
             if (new_password is None or re_new_password is None or
                  uid is None or token is None or
                  new_password=='' or re_new_password =='' or
                  uid=='' or token==''
                  ):
                 return HttpResponse("Fill all fields")
             else:
                 payload = {"uid": uid, 
                             "token": token, 
                             "new_password":new_password,
                             "re_new_password":re_new_password
                             }
                 print(payload)
                 return djoser_getpost("reset_password_confirm", payload)

@api_view(['GET'])       
@permission_classes([AllowAny])    
def activate_user(request, uid, token):
    if request.method == 'GET':
        payload = {"uid": uid, "token": token}
        return djoser_getpost("activation", payload)

 
@api_view(['GET'])    
@permission_classes((IsAdminUser,)) 
def test(request):
    send_mail(
    'Cycling-init-bot test email',
    'This is a test.',
    'cyclinginitbot@gmail.com',
    ['maxime.delzenne@gmail.com'],
    fail_silently=False,
    )
    return HttpResponse("ok")
#@api_view(['GET'])       
#@permission_classes([AllowAny])    
#def resend_activation(request, email):
#    if request.method == 'GET':
#        payload = {'email':email}
#        return djoser_getpost("resend_activation", payload)
    
