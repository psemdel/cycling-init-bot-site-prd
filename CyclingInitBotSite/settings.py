"""
Django settings for CyclingInitBotSite project.

Generated by 'django-admin startproject' using Django 3.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
import sentry_sdk
import configparser

from datetime import timedelta
from sentry_sdk.integrations.django import DjangoIntegration

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

DEBUG=False

#if DEBUG:
with open('CyclingInitBotSite/etc/secret_key.txt') as f:
    SECRET_KEY = f.read().strip()

with open('CyclingInitBotSite/etc/DB_secret_key.txt') as f:
    DB_SECRET_KEY = f.read().strip()
    
with open('CyclingInitBotSite/etc/g.txt') as f:
    EMAIL_SECRET_KEY = f.read().strip()    
with open('CyclingInitBotSite/etc/DB_user.txt') as f:
    DB_USER = f.read().strip()  
# SECURITY WARNING: keep the secret key used in production secret!
#
# SECURITY WARNING: don't run with debug turned on in production!

if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_HOST_USER = 'cyclinginitbot@gmail.com'
    EMAIL_HOST_PASSWORD =  EMAIL_SECRET_KEY
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    DEFAULT_FROM_EMAIL = 'cyclinginitbot@gmail.com'

CSRF_COOKIE_SECURE=False
if DEBUG:
    ALLOWED_HOSTS =['*']
else:  
    ALLOWED_HOSTS = ['cycling-init-bot.toolforge.org']

# Application definition
if DEBUG:
        INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
          # Django REST framework 
        'rest_framework',
        'rest_framework.authtoken',
        'djoser',
        'bot_requests.apps.BotRequestsConfig',
        'users.apps.UsersConfig',
        # CORS
        'corsheaders', 
    ]
else:
     INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
          # Django REST framework 
        'rest_framework',
        'rest_framework.authtoken',
        'djoser',
        'bot_requests.apps.BotRequestsConfig',
        'email_manager.apps.EmailManagerConfig',
        'users.apps.UsersConfig',
    ]  


MIDDLEWARE = [
    # CORS
   # 'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',  
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
   #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',    
]

ROOT_URLCONF = 'CyclingInitBotSite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
        
REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': [
            'rest_framework_simplejwt.authentication.JWTAuthentication',
            'rest_framework.authentication.SessionAuthentication',
      ],
      'DEFAULT_PERMISSION_CLASSES': ( 'rest_framework.permissions.IsAuthenticated', ),
} 

SIMPLE_JWT = {
   'ACCESS_TOKEN_LIFETIME':  timedelta(minutes=15),     #
   'AUTH_HEADER_TYPES': ('Bearer',),
}

DJOSER = {
    'SEND_ACTIVATION_EMAIL': True,
    'ACTIVATION_URL': 'api/email/activate/{uid}/{token}',
    'PASSWORD_RESET_CONFIRM_URL': 'api/email/password-reset/{uid}/{token}',
    
    'SERIALIZERS': {
         'user_create': 'users.serializers.UserSerializer'
    }
}

WSGI_APPLICATION = 'CyclingInitBotSite.wsgi.application'

if not DEBUG:
    HOME=os.environ.get('HOME')

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
if DEBUG:
    DATABASES = {
    'default': {
         'ENGINE': 'django.db.backends.mysql',
         'NAME': 'cyclingdb', 
         'USER': DB_USER,
         'PASSWORD': DB_SECRET_KEY,
         'HOST': 'localhost',
         'PORT': '',
     }
    }
else:
    replica_path=HOME + '/replica.my.cnf'
    if os.path.exists(replica_path):
        config = configparser.ConfigParser()
        config.read(replica_path)
    else:
        print('replica.my.cnf file not found')
    
    DATABASES = {
    'default': {
         'ENGINE': 'django.db.backends.mysql',
         'NAME': 's54511__maria_cyclingdb',
         'USER': config['client']['user'],
         'PASSWORD': config['client']['password'],
         'HOST': 'tools.db.svc.eqiad.wmflabs',
         'PORT': '',
         'OPTIONS': {
            'sql_mode': 'traditional',
        }
     }
    }
# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


CORS_ORIGIN_ALLOW_ALL = False

if DEBUG:
    CORS_ORIGIN_WHITELIST = (
    'http://localhost:4200',
    )
else:
    CORS_ORIGIN_WHITELIST = (
        'https://cycling-init-bot-site.herokuapp.com',
        'http://www.cycling-init-bot.site',
        'https://cycling-init-bot.toolforge.org/',
        'toolforge.org',
    ) 
    
if DEBUG:
    URL_ROOT= 'http://localhost:8000' 
else:
    URL_ROOT='https://cycling-init-bot.toolforge.org/'
    
# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

REDIS_PASSWORD=""

if DEBUG:
    REDIS_HOST="localhost"
else:
    REDIS_HOST="tools-redis.svc.eqiad.wmflabs"

REDIS_PORT="6379"
REDIS_DB=0

REDIS_URL = ':%s@%s:%s/%d' % (
        REDIS_PASSWORD,
        REDIS_HOST,
        REDIS_PORT,
        REDIS_DB)

CELERY_BROKER_URL = 'redis://'+REDIS_URL #redis://:password@hostname:port/db_number

# CELERY
if not DEBUG:
    CELERY_BROKER_POOL_LIMIT= 1
    CELERY_BROKER_HEARTBEAT = None # We're using TCP keep-alive instead
    CELERY_BROKER_CONNECTION_TIMEOUT = 30 # May require a long timeout due to Linux DNS timeouts etc
    CELERY_RESULT_BACKEND = None 
    CELERY_WORKER_PREFETCH_MULTIPLIER = 1
#CELERY_RESULT_BACKEND = 'pyamqp://guest@localhost//'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

DJANGO_STATIC_HOST=''
STATIC_URL = DJANGO_STATIC_HOST + '/static/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'uploads')
MEDIA_URL = DJANGO_STATIC_HOST + '/uploads/'

#sentry
sentry_sdk.init(
    dsn="https://5ef588d52c64406da19b637880d0c3b3@o455109.ingest.sentry.io/5447219",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)