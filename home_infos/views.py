from django.shortcuts import render
from .serializers import HomeInfoSerializer
from .models import HomeInfo
from django.http.response import JsonResponse
from rest_framework import status

# Create your views here.
def get_news(request):
    if request.method == 'GET':
        serializer= HomeInfoSerializer
        home_info = HomeInfo.objects.all()
        requests_serializer = serializer(home_info, many=True)
        return JsonResponse(requests_serializer.data, safe=False)   
    else:
        return JsonResponse({'error':'no GET request'}, status=status.HTTP_400_BAD_REQUEST)
    


