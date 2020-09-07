#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Jun 28 19:40:15 2020

@author: maxime
"""
from .serializers import *
from .models import *

def routine_to_model(routine):
    dic={
     "create_rider":CreateRiderRequest,
     "import_classification":ImportClassificationRequest,
     "race":RaceRequest,
     "stages":StagesRequest,
     "team":TeamRequest,
     "sort_date":SortDateRequest,
     "sort_name":SortNameRequest,
     "UCIranking":UCIrankingRequest,
     "start_list":StartListRequest,
     "national_all_champs":NationalAllChampsRequest,
     "national_one_champ":NationalOneChampRequest
     }
    if routine in dic:
        return dic[routine] 
    else: 
        print("routine not found")
        return None
    
def routine_to_serializer(routine):
    dic={
     "create_rider":CreateRiderRequestSerializer,
     "import_classification":ImportClassificationRequestSerializer,
     "race":RaceRequestSerializer,
     "stages":StagesRequestSerializer,
     "team":TeamRequestSerializer,
     "sort_date":SortDateRequestSerializer,
     "sort_name":SortNameRequestSerializer,
     "UCIranking":UCIrankingRequestSerializer,
     "start_list":StartListRequestSerializer,
     "national_all_champs":NationalAllChampsRequestSerializer,
     "national_one_champ":NationalOneChampRequestSerializer
     }
    if routine in dic:
        return dic[routine] 
    else: 
        print("routine not found")
        return None    