#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Apr 23 18:03:01 2020

@author: maxime
"""
import pywikibot #avoid confusion
import os

from django.utils import timezone
from sentry_sdk import capture_message
from .dic import routine_to_model
from .log import save_log #log to the user
from bot_src.src.base import Log
from django.db import connection

site = pywikibot.Site("wikidata", "wikidata")
repo = site.data_repository()

#required as BotRequest is abstract
def load_request(rq_id, routine):
    table=routine_to_model(routine)
    rq=table.objects.get(pk=rq_id)
    rq.status = "started"
    rq.process_start_time=timezone.now()
    rq.save()
    return rq 

def kill_file(rq):
    filepath='uploads/'+rq.result_file_name
    os.remove(filepath)
    print("file removed")
    
def datetime_to_Wbtime(site, tdatetime):
    if tdatetime.year:
        tyear=tdatetime.year
    else:
        tyear=2020
    
    if tdatetime.month:
        tmonth=tdatetime.month
    else:
        tmonth=1
        
    if tdatetime.day:
        tday=tdatetime.day
    else:
        tday=1
        
    return pywikibot.WbTime(site=site,year=tyear, month=tmonth, day=tday, precision='day')

def run_bot(rq_id, rq_routine):
    #code 10: already there
    #code 11: general crash
    try:
        log=None
        status=10
        rq=load_request(rq_id, rq_routine)
        rq.log=""
        rq.save()
        save_log(rq_id, rq_routine, "request loaded")
        save_log(rq_id, rq_routine, rq_routine + " routine selected")
        test=False #run the functions but make no change to wikidata
        test_site=False #don't run the functions
        
        print("author: " +str(rq.author))
        if rq_routine=="create_rider":
            from bot_src.src.rider_fast_init import RiderFastInit 
            
            if not test_site:
                f=RiderFastInit(rq.name,rq.nationality,rq.gender)
                status, log, result_id=f.main()
                
                rq.result_id=result_id
                rq.save()
        
        elif rq_routine=="import_classification":
             from bot_src.src.classification_importer import ClassificationImporter
             maxkk=10
             
             if not test_site:
                 f=ClassificationImporter(rq.classification_type,
                                          rq.item_id,
                                          maxkk, 
                                          test=test ,
                                          file=rq.result_file_name,
                                          year=rq.year,
                                          startliston=True,
                                          man_or_woman=rq.gender)
                 status, log=f.main()
                 
        elif rq_routine=="race":
            from bot_src.src.race_creator import RaceCreator
            
            man_or_woman=rq.gender
            time_of_race=datetime_to_Wbtime(site, rq.time_of_race)
            if rq.race_type: #stage race
                single_race=False
                
                if rq.prologue:
                   first_stage=0
                else:
                   first_stage=1 
                
                end_of_race=datetime_to_Wbtime(site, rq.end_of_race)
                
                if not test_site:
                    f=RaceCreator(
                        race_name=rq.name,
                        single_race=single_race,
                        man_or_woman=man_or_woman,
                        id_race_master=rq.item_id,
                        countryCIO=rq.nationality,
                        classe=rq.race_class,
                        start_date=time_of_race,
                        edition_nr=rq.edition_nr,
                        end_date=end_of_race,
                        only_stages=False,
                        create_stages=rq.create_stages, 
                        first_stage=first_stage,
                        last_stage=rq.last_stage,
                        )
                    status, log, result_id=f.main()
            else:
                single_race=True
                
                if not test_site:
                    f=RaceCreator(
                           race_name=rq.name,
                           single_race=single_race,
                           man_or_woman=man_or_woman,
                           start_date=time_of_race,
                           edition_nr=rq.edition_nr,
                           id_race_master=rq.item_id,
                           countryCIO=rq.nationality,
                           classe=rq.race_class)
                    status, log, result_id=f.main()

            rq.result_id=result_id
            rq.save()
                    
        elif rq_routine=="stages":
            from bot_src.src.race_creator import RaceCreator

            single_race=False
                        
            if rq.prologue:
                first_stage=0
            else:
                first_stage=1 

            if not test_site:
                f= RaceCreator(
                    stage_race_id=rq.item_id, 
                    first_stage=first_stage,
                    last_stage=rq.last_stage,
                    only_stages=True
                    )
                status, log, _=f.main()
                connection.close() #otherwise connection lost

        elif rq_routine=="team":
            from bot_src.src.team_creator import TeamCreator
            
            if not test_site:
                f=TeamCreator(rq.name,
                              rq.item_id,
                              rq.nationality,
                              rq.UCIcode,
                              rq.year,
                              category_id=rq.category_id)
                status, log, result_id=f.main() 

                rq.result_id=result_id
                rq.save()

        elif rq_routine=="national_team":
            from bot_src.src.national_team_creator import NationalTeamCreator
            
            if not test_site:
                f=NationalTeamCreator( rq.category,
                                       rq.year_begin,
                                       rq.year_end,
                                       country=rq.nationality)
                status, log, result_id=f.main()    

                rq.result_id=result_id
                rq.save()

        elif rq_routine=="national_team_all":
            from bot_src.src.national_team_creator import NationalTeamCreator

            if not test_site:
                f=NationalTeamCreator( rq.category,
                                       rq.year_begin,
                                       rq.year_end,
                                       country=False)
                status, log, result_id=f.main()    

                rq.result_id=result_id
                rq.save()
                
        elif rq_routine=="sort_date":
            from bot_src.src.sorter import DateSorter

            if not test_site:
                f= DateSorter(rq.item_id,rq.prop,test=test)
                status, log=f.main()   


        elif rq_routine=="sort_name":
            from bot_src.src.sorter import NameSorter
            
            if not test_site:
                f= NameSorter(rq.item_id, rq.prop,test=test)
                status, log=f.main()   
            
        elif rq_routine=="UCIranking":
            from bot_src.src.uci_classification import UCIClassification

            if not test_site:
                f=UCIClassification(
                    UCIranking=rq.UCIranking,
                    id_master_UCI=rq.item_id,
                    filename=rq.result_file_name,
                    cleaner=False,
                    man_or_woman=rq.gender,
                    bypass=rq.bypass,
                    year=rq.year,
                    test=test)
                status, log=f.main()
            
        elif rq_routine=="start_list":
            from bot_src.src.startlist_importer import StartlistImporter
            
            if rq.race_type: #stage race
                if rq.moment:
                    prologue_or_final=1 #0=prologue, 1=final, 2=one day race
                else:
                    prologue_or_final=0
            else:
                prologue_or_final=2

            if not test_site:
                f=StartlistImporter(prologue_or_final, 
                                    rq.item_id, 
                                    rq.chrono,
                                    rq.gender, 
                                    rq.force_nation_team,
                                    file=rq.result_file_name,
                                    test=test)
                status, log=f.main()
                print("startlist in run finished")
                connection.close() #otherwise connection lost
            
        elif rq_routine=="national_all_champs":
            from bot_src.src.national_championship_creator import NationalChampionshipCreator
            
            man_or_woman=u'both' 
            option=u'clmon' #'clmoff'
            start_year=rq.year
            end_year=rq.year
            #no CC
            
            if not test_site:
                f=NationalChampionshipCreator(man_or_woman,option, start_year,end_year,False)
                status, log=f.main()   
            ##with CC
            if not test_site:
                f=NationalChampionshipCreator(man_or_woman,option, start_year,end_year,True)
                status, log=f.main() 
            
        elif rq_routine=="national_one_champ":
            from bot_src.src.national_championship_creator import NationalChampionshipCreator
            
            man_or_woman=rq.category
            option=u'clmon' #'clmoff'
            start_year=rq.year_begin
            end_year=rq.year_end
            if not test_site:
                f=NationalChampionshipCreator(man_or_woman,option, start_year,end_year,False,
                                              country=rq.nationality)
                status, log=f.main()
 
        else:
            capture_message("rq_id: "+ rq_id + "rq_routine: "+ rq_routine + " routine not managed", level="info")
            save_log(rq_id, rq_routine,"routine not managed")
            return 1
        
        if log is None:
             log=Log()
             log.concat("log not found at the end of run")
        save_log(rq_id, rq_routine,log.txt,display=False)
        table=routine_to_model(rq_routine)
        rq=table.objects.get(pk=rq_id)
        routine_with_file=["import_classification","start_list","UCIranking"]
        rq.process_end_time=timezone.now()
        
        if status==0:
            save_log(rq_id, rq_routine, "request completed")
            rq.status = "completed"
            rq.save() 
            if rq.routine in routine_with_file:
                kill_file(rq)
            return 0
        else:
            save_log(rq_id, rq_routine, "request failed")
            capture_message("rq_id: "+ str(rq_id) + "rq_routine: "+ str(rq_routine) + " failed", level="info")
            rq.status = "failed"
            rq.save() 
            return 10
     
    except Exception as msg:
        print(msg)
        if log is None:
            log=Log()
        table=routine_to_model(rq_routine)
        rq=table.objects.get(pk=rq_id)
        save_log(rq_id, rq_routine, "request failed, most probably max lag of wikidata, retry in 10 minutes" )
        rq.status = "failed"
        rq.process_end_time=timezone.now()
        rq.save() 
        return 11   
    except:
        table=routine_to_model(rq_routine)
        rq=table.objects.get(pk=rq_id)
        if log is None:
            log=Log()
        save_log(rq_id, rq_routine, "request failed, total")

        rq.status = "failed"
        rq.process_end_time=timezone.now()
        rq.save() 
        return 10
    
