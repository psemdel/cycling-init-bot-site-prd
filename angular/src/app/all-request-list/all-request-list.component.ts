import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { Observable } from 'rxjs';

import {AuthenticationService } from '@ser/authentication.service';
import { BotRequest, User} from '@app/models/models';

@Component({
  selector: 'app-all-request-list',
  templateUrl: './all-request-list.component.html',
  styleUrls: ['./all-request-list.component.css']
})

export class AllRequestListComponent implements OnInit {
  currentUser: User;
  create_rider_botrequests: Observable<BotRequest[]>;
  import_classification_botrequests: Observable<BotRequest[]>;
  national_all_champs_botrequests: Observable<BotRequest[]>;
  national_one_champ_botrequests: Observable<BotRequest[]>;
  start_list_botrequests: Observable<BotRequest[]>;
  race_botrequests: Observable<BotRequest[]>;
  stages_botrequests: Observable<BotRequest[]>;
  team_botrequests: Observable<BotRequest[]>;
  UCIranking_botrequests: Observable<BotRequest[]>;
  sort_date_botrequests: Observable<BotRequest[]>;
  sort_name_botrequests: Observable<BotRequest[]>; 
    
   constructor(private botRequestService: BotRequestService,
               private authenticationService: AuthenticationService
   ) {
   this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.create_rider_botrequests = 
      this.botRequestService.getAllRq('create_rider',this.currentUser.id);
      
    this.import_classification_botrequests = 
      this.botRequestService.getAllRq('import_classification',this.currentUser.id);
      
    this.national_all_champs_botrequests= 
      this.botRequestService.getAllRq('national_all_champs',this.currentUser.id);
    
    this.national_one_champ_botrequests= 
      this.botRequestService.getAllRq('national_one_champ',this.currentUser.id);
      
    this.start_list_botrequests =
      this.botRequestService.getAllRq('start_list',this.currentUser.id);
      
    this.race_botrequests =
      this.botRequestService.getAllRq('race',this.currentUser.id);
      
    this.stages_botrequests =
      this.botRequestService.getAllRq('stages',this.currentUser.id); 
    
    this.team_botrequests =
      this.botRequestService.getAllRq('team',this.currentUser.id);   
      
    this.UCIranking_botrequests =
      this.botRequestService.getAllRq('UCIranking',this.currentUser.id);  
   
    this.sort_date_botrequests =
      this.botRequestService.getAllRq('sort_date',this.currentUser.id); 
      
    this.sort_name_botrequests =
      this.botRequestService.getAllRq('sort_name',this.currentUser.id); 
      
  }

}
