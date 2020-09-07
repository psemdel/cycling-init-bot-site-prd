#Django
from django.contrib.auth import logout
from django.http.response import JsonResponse

#Rest
from rest_framework.parsers import JSONParser 
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

#app
from .serializers import UserProfileSerializer,CustomTokenObtainPairSerializer
from .models import UserProfile

#adapt jwt sending
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET'])       
@permission_classes([IsAdminUser])         
def users(request):
    if request.method == 'GET':
        userProfile_requests = UserProfile.objects.all()
        requests_serializer = UserProfileSerializer(userProfile_requests, many=True)
        return JsonResponse(requests_serializer.data, safe=False) 
    else:
        return JsonResponse({'user get':'failure'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])       
@permission_classes([IsAuthenticated])
def mylogout(request):
    if request.method == 'POST': 
        try:
            request_parsed=JSONParser().parse(request)
            logout(request_parsed)
            return JsonResponse({'log out':'success'},status=status.HTTP_202_ACCEPTED) 
        except:
            
            return JsonResponse({'log out':'failure'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse({'log out':'failure'}, status=status.HTTP_400_BAD_REQUEST)
