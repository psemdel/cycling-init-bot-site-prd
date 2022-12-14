"""CyclingInitBotSite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
#django
from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import RedirectView
from django.conf.urls import handler404

#app
from . import views
from users.views import CustomTokenObtainPairView 

#djoser
import djoser_local

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path('', views.HomePageView.as_view(), name='index'),
    path('home', views.HomePageView.as_view()),
    path('api/admin/', admin.site.urls),
    path('api/bot_requests/', include('bot_requests.urls')),
    path('api/users/', include('users.urls')),
    path('api/email/', include('email_manager.urls')),
    path('api/home/', include('home_infos.urls')),
    path('auth/jwt/create/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('auth/', include('djoser_local.urls'), name='djoser_root'),
    path('auth/', include('djoser_local.urls.jwt')),
    path('sentry-debug/', trigger_error),
]

handler404='CyclingInitBotSite.views.view_404'
