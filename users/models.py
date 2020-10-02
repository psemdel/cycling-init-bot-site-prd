#django
from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from sentry_sdk import capture_message

class UserProfile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    wiki_name = models.CharField(max_length=100,null=False, blank=False)
    capture_message("user " + user + " created")
    
    def __str__(self):
        return self.user.username   
