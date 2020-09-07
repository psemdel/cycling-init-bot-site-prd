#django
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.utils import timezone
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.models import User
from django.conf import settings
#rest
from rest_framework.parsers import JSONParser 
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import permission_classes, api_view
from rest_framework import generics

#other
from ratelimit.decorators import ratelimit
import json
from celery import shared_task
import time

#app
from .serializers import *
from .models import *
from .run import run_bot
from .dic import routine_to_model, routine_to_serializer
from .log import save_log

if settings.DEBUG:
    RATELIMRQ='200000/h'
else:
    RATELIMRQ='10/h'

def index(request):
   return HttpResponse("<p>bot_requests index</p>")

class DetailView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    model = BotRequest
    template_name = 'bot_requests/detail.html'
  
##### POST RQ #####
def serial_save(request_serializer, request, rq_data):
    if request_serializer.is_valid():
        rq=request_serializer.save()
        return run_autocheck(rq_data, request, rq.id)
    else:
        print('serializer error: ')
        print(request_serializer.errors)
        return JsonResponse(request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

@ratelimit(key='ip', rate=RATELIMRQ)
@api_view(['POST'])  
def create_rq(request,routine):
    try:
        if request.method == 'POST':
            serializer=routine_to_serializer(routine)
            rq_data=JSONParser().parse(request)
            rq_data.update(entry_time=timezone.now() ) 
            rq_data.update(routine=routine)
            
            ##supplementary info depending on the routine
            if routine in ["create_rider", "race", "national_all_champs", "national_one_champ"]:
                rq_data.update(item_id="Q1")
            
            request_serializer =serializer(data=rq_data)
            return serial_save(request_serializer, request, rq_data)
        else:
            return JsonResponse({'error':'no POST request'}, status=status.HTTP_400_BAD_REQUEST)   
    except:
        return JsonResponse({'status create':'failed'}, status=status.HTTP_417_EXPECTATION_FAILED)    

@ratelimit(key='ip', rate=RATELIMRQ)     
@api_view(['POST'])       
def create_file_rq(request,routine):  
     if request.method == 'POST' and request.FILES:
        try:
            #upload file
            serializer=routine_to_serializer(routine)
            uploaded_file=request.FILES['file']
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            rq_data= (json.loads(request.POST['botrequest'] ))
            rq_data.update(entry_time=timezone.now() ) 
            rq_data.update(routine=routine)
            rq_data.update(result_file_name=name)
            request_serializer =serializer(data=rq_data)
            return serial_save(request_serializer, request, rq_data)
        except:
            print("plantage by file")  
            return JsonResponse({'file':'failed'}, status=status.HTTP_400_BAD_REQUEST)    

@shared_task
def async_run_bot(rq_id, rq_routine):
    res=11
    max_iter=1
    kk=0
    
    while res==11 and kk<max_iter:
        try:
            res=run_bot(rq_id, rq_routine)
            if res==11:
                kk=kk+1
                print("waiting 10 min")
                time.sleep(600) #wait 10 minutes before retrying
        except:
            print("run_bot crashed")
            break

def run_autocheck(rq_data, request, rq_id):
    print("check if autocheck")
    user=User.objects.get(pk=rq_data["author"])
    no_autocheck_run_routines=["national_all_champs","national_one_champ","UCIranking"] #to have a double check
    
    if (user.has_perm('bot_requests.can_run_requests') and 
    rq_data["routine"] and rq_data["routine"] not in  no_autocheck_run_routines):
        print("run autocheck")
        async_run_bot.delay(rq_id,rq_data["routine"])
        #not required
        #if run_error==0:
        return JsonResponse({'ras':'ras'}, status=status.HTTP_200_OK) 
        #else:
        #    return JsonResponse({'error':'bot run not successful'}, status=status.HTTP_417_EXPECTATION_FAILED)        
    return JsonResponse({'ras':'ras'}, status=status.HTTP_201_CREATED) 

def check_if_failed(rq_id, routine):
    table=routine_to_model(routine)
    rq=table.objects.get(pk=rq_id)
    if rq.status == "failed":
        return True
    else:
        return False

@api_view(['POST'])    
#@permission_classes((IsAdminUser,))
def run(request):
    if request.method == 'POST':
        run_data=JSONParser().parse(request)
        
        if run_data["routine"]:
            if run_data["id"]:
                if IsAdminUser or check_if_failed(run_data["id"],run_data["routine"]):
                    save_log(run_data["id"],run_data["routine"], "running request")
                    async_run_bot.delay(run_data["id"],run_data["routine"])
                    return JsonResponse({'ras':'ras'}, status=status.HTTP_200_OK) 
                else:
                    return JsonResponse({'error':'no POST request'}, status=status.HTTP_400_BAD_REQUEST)   
            else:
                return JsonResponse({'error':'not authorized'}, status=status.HTTP_401_UNAUTHORIZED)  
        else:
            return JsonResponse({'error':'no routine defined'}, status=status.HTTP_400_BAD_REQUEST)  
    else:
        return JsonResponse({'error':'no POST request'}, status=status.HTTP_400_BAD_REQUEST)   


@api_view(['DELETE'])   
def delete_rq(request,pk,routine):
    try:
        if request.method == 'DELETE':
            table=routine_to_model(routine)
            if pk is not None:
                try:
                    rq =table.objects.get(pk=pk)
                except:
                    return JsonResponse({"delete":"primary key not found"},status=status.HTTP_400_BAD_REQUEST)
                rq.delete()
            return JsonResponse({"delete":"success"},status=status.HTTP_204_NO_CONTENT)
        else:
            return JsonResponse({"delete":"failed"},status=status.HTTP_400_BAD_REQUEST)
    except:
        print("plantage")
        return JsonResponse({"delete":"plantage"},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])    
def get_request_list(request, userid, routine):
    if request.method == 'GET':
        table=routine_to_model(routine)
        serializer=routine_to_serializer(routine)
        bot_requests = table.objects.filter(author=userid)
        requests_serializer = serializer(bot_requests, many=True)
        return JsonResponse(requests_serializer.data, safe=False)   
    else:
        return JsonResponse({'error':'no GET request'}, status=status.HTTP_400_BAD_REQUEST) 

@api_view(['GET'])    
@permission_classes((IsAdminUser,))
def all_get_request_list(request, userid, routine):
    if request.method == 'GET':
            table=routine_to_model(routine)
            serializer=routine_to_serializer(routine)
            bot_requests = table.objects.all()
            requests_serializer = serializer(bot_requests, many=True)
            return JsonResponse(requests_serializer.data, safe=False)   
    else:
        return JsonResponse({'error':'no GET request'}, status=status.HTTP_400_BAD_REQUEST)
    


