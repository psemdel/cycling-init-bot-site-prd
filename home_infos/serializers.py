# -*- coding: utf-8 -*-

#rest
from rest_framework import serializers 

#app
from .models import HomeInfo

class HomeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeInfo
        fields ='__all__'