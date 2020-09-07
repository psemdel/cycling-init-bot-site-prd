from django.db import models
from django.conf import settings

class BotRequest(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    entry_time=models.DateTimeField(null=False,blank=False)
    process_start_time=models.DateTimeField(null=True, blank=True)
    process_end_time=models.DateTimeField(null=True, blank=True)
    status=models.CharField(max_length=70, blank=False, default='pending')
    routine = models.CharField(max_length=100,blank=False)
    item_id= models.CharField(max_length=70, blank=False)
    log=models.TextField(blank=True)

    class Meta:
        abstract = True

class BotRequestWithFile(BotRequest):
    result_file_name = models.CharField(max_length=100, blank=False)
    
    class Meta:
        abstract = True

class NationalAllChampsRequest(BotRequest):
     ##--Create rider--
    year = models.IntegerField(blank=False)
    
    def __str__(self):
        return self.routine + " "+ self.year   
    
class NationalOneChampRequest(BotRequest):
     ##--Create rider--
    nationality = models.CharField(max_length=3, blank=True)
    year_begin = models.IntegerField(blank=False)
    year_end = models.IntegerField(blank=False)
    category =models.CharField(max_length=10, blank=True)   
    
    def __str__(self):
        return self.routine + " "+ self.nationality     
        
class CreateRiderRequest(BotRequest):
     ##--Create rider--
    nationality = models.CharField(max_length=3, blank=True)
    name = models.CharField(max_length=70, blank=True)
    gender =models.CharField(max_length=5, blank=True)   
    result_id=models.CharField(max_length=30, blank=True)
    
    def __str__(self):
        return self.routine + " "+ self.name   
   
class ImportClassificationRequest(BotRequestWithFile):
   classification_type= models.IntegerField(blank=False)
   year = models.IntegerField(blank=False,default=2020)
   gender =models.CharField(max_length=5, blank=True)   
   
   def __str__(self):
        return self.routine + " "+ self.item_id
    
class StartListRequest(BotRequestWithFile):
   time_of_race=models.DateTimeField(null=False,blank=False)
   race_type= models.BooleanField(blank=False)
   chrono= models.BooleanField(blank=False)
   moment= models.BooleanField(blank=False)
   gender =models.CharField(max_length=5, blank=True)#for champ
     
   def __str__(self):
        return self.routine + " "+ self.item_id

class UCIrankingRequest(BotRequestWithFile):
   year = models.IntegerField(blank=False)
     
   def __str__(self):
        return self.routine + " "+ self.item_id

class RaceRequest(BotRequest):
   name = models.CharField(max_length=100, blank=False,default="race")
    
   time_of_race=models.DateTimeField(null=False,blank=False)
   end_of_race=models.DateTimeField(null=True,blank=True)
   nationality = models.CharField(max_length=3, blank=True)
   result_id=models.CharField(max_length=30, blank=True)
   
   race_type= models.BooleanField(blank=False)
   race_class = models.CharField(max_length=20, blank=True)
   
   create_stages= models.BooleanField(blank=True)
   prologue= models.BooleanField(blank=True)
   last_stage=models.IntegerField(blank=True)
   edition_nr=models.IntegerField(blank=False)
     
   def __str__(self):
        return self.routine + " "+ self.name

class StagesRequest(BotRequest):
   prologue= models.BooleanField(blank=False)
   last_stage=models.IntegerField(blank=False)
     
   def __str__(self):
        return self.routine + " "+ self.item_id
    
class TeamRequest(BotRequest):
   name = models.CharField(max_length=100, blank=False,default="team")
    
   year = models.IntegerField(blank=False)
   nationality = models.CharField(max_length=3, blank=True)
   UCIcode = models.CharField(max_length=3, blank=True)
   result_id=models.CharField(max_length=30, blank=True)
    
   def __str__(self):
        return self.routine + " "+ self.name  
    
class SortDateRequest(BotRequest):
   prop = models.IntegerField(blank=False)
    
   def __str__(self):
        return self.routine + " "+ self.item_id
    
class SortNameRequest(BotRequest):
   prop = models.IntegerField(blank=False)
    
   def __str__(self):
        return self.routine + " "+ self.item_id
    
