#django
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    wiki_name = models.CharField(max_length=100,null=False, blank=False)
    
    def __str__(self):
        return self.user.username   
