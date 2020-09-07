#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar 30 17:40:03 2020

@author: maxime
"""
#rest
from rest_framework import serializers 

#app
from bot_requests.models import *


class BotRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotRequest
        fields = ('name')

class CreateRiderRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = CreateRiderRequest
        fields ='__all__'

class ImportClassificationRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = ImportClassificationRequest
        fields ='__all__'
        
class StartListRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = StartListRequest
        fields ='__all__'       
 
class NationalAllChampsRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = NationalAllChampsRequest
        fields ='__all__'
        
class NationalOneChampRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = NationalOneChampRequest
        fields ='__all__'

class TeamRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = TeamRequest
        fields ='__all__'
    
class UCIrankingRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = UCIrankingRequest
        fields ='__all__'

class StagesRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = StagesRequest
        fields ='__all__'

class RaceRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = RaceRequest
        fields ='__all__'
    
class SortDateRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = SortDateRequest
        fields ='__all__'
       
class SortNameRequestSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = SortNameRequest
        fields ='__all__'        
        
