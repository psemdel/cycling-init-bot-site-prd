import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { Observable, concat } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

import {AuthenticationService } from '@ser/authentication.service';
import { BotRequest, User} from '@app/models/models';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
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
  all_botrequests: Observable<BotRequest[]>; 
  total_length:number;
 
   constructor(private botRequestService: BotRequestService,
               private authenticationService: AuthenticationService,
   ) {
   this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit() {
    this.reloadData();
    IntervalObservable.create(60000) //every minute
    .subscribe(
        data => {
        this.reloadData(); //reload nb_started_routines
        })
  }
 
 reloadData() {
    this.create_rider_botrequests=
      this.botRequestService.getRq('create_rider',this.currentUser.id);

    this.import_classification_botrequests = 
      this.botRequestService.getRq('import_classification',this.currentUser.id);
      
    this.national_all_champs_botrequests= 
      this.botRequestService.getRq('national_all_champs',this.currentUser.id);
    
    this.national_one_champ_botrequests= 
      this.botRequestService.getRq('national_one_champ',this.currentUser.id);
     
    this.start_list_botrequests =
      this.botRequestService.getRq('start_list',this.currentUser.id);
      
    this.race_botrequests =
      this.botRequestService.getRq('race',this.currentUser.id);
          
    this.stages_botrequests =
      this.botRequestService.getRq('stages',this.currentUser.id); 
     
    this.team_botrequests =
      this.botRequestService.getRq('team',this.currentUser.id);   
      
    this.UCIranking_botrequests =
      this.botRequestService.getRq('UCIranking',this.currentUser.id);  
   
    this.sort_date_botrequests =
      this.botRequestService.getRq('sort_date',this.currentUser.id); 
     
    this.sort_name_botrequests =
      this.botRequestService.getRq('sort_name',this.currentUser.id); 
    
    this.all_botrequests=concat(
         this.create_rider_botrequests,
         this.import_classification_botrequests,
         this.national_all_champs_botrequests,
         this.national_one_champ_botrequests,
         this.start_list_botrequests,
         this.race_botrequests,
         this.stages_botrequests,
         this.team_botrequests,
         this.UCIranking_botrequests,
         this.sort_date_botrequests,
         this.sort_name_botrequests,
         );
        
    this.total_length=0;    
    this.all_botrequests.subscribe(
      result => { this.total_length+= result.length;
      })
  }

  delete_rq(routine: string, botrequest: BotRequest){
       this.botRequestService.deleteRq(routine,botrequest.id)
      .subscribe(
        data => {},
        error => console.log(error));
  }
  
  delete_rq_all(){
     this.all_botrequests.subscribe(rqs=> {
         rqs.forEach( rq => {
             this.delete_rq(rq.routine, rq);
         })
         this.reloadData()
    })
  }
  
  
}