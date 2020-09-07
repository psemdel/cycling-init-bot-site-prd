#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr 27 21:24:48 2020

@author: maxime
"""
#django
from django.db.models.signals import post_save
from django.contrib.auth.models import User, Group
from django.dispatch import receiver

#rest
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers 

#other
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer

#app
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields ="__all__"

class UserSerializer(BaseUserRegistrationSerializer):
     class Meta(BaseUserRegistrationSerializer.Meta):
        fields = ('username','password','email','first_name','last_name','id')

#custom djoser   
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        ## This data variable will contain refresh and access tokens
        data = super().validate(attrs)
        ## You can add more User model's attributes like username,email etc. in the data dictionary like this.
        data['username'] = self.user.username
        data['id']=self.user.id
        data['level']=self.user.is_staff #not for safety, just display
        return data

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    new_user_group = Group.objects.get(name="new_user")
    instance.groups.add(new_user_group)
    
    if created:
        UserProfile.objects.create(user=instance)
  #wiki_name to be added        
        