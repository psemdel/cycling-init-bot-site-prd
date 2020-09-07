from django.contrib import admin
from .models import (CreateRiderRequest, ImportClassificationRequest,StagesRequest, RaceRequest,
                    StartListRequest,NationalAllChampsRequest,NationalOneChampRequest, 
                    UCIrankingRequest, TeamRequest, SortDateRequest, SortNameRequest
                    )

# Register your models here.
admin.site.register(CreateRiderRequest)  
admin.site.register(ImportClassificationRequest)
admin.site.register(StagesRequest)
admin.site.register(RaceRequest)
admin.site.register(StartListRequest)
admin.site.register(NationalAllChampsRequest)
admin.site.register(NationalOneChampRequest)
admin.site.register(UCIrankingRequest)
admin.site.register(TeamRequest)
admin.site.register(SortDateRequest)
admin.site.register(SortNameRequest)
