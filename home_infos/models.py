from django.db import models

# Create your models here.

class HomeInfo(models.Model):
    news=models.TextField(blank=True)