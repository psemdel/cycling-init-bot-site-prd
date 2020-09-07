import { Injectable } from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter  } from 'rxjs/operators';

import {AuthenticationService } from '@ser/authentication.service';
import {AlertService } from '@ser/alert.service';

import {BotRequest, User} from '@app/models/models';
import {dic_of_routines} from '@app/models/lists';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

@Injectable({
  providedIn: 'root'
})
export class MonitoringService    {
  running_rq: number[]; //list of all running rq
  //saved as
  started_routines_id_str: string;

  running_routine: string[];
  //saved as
  started_routines_str: string;

  public nb_started_routines: number; //only since opening of browser
  //saved as
  nb_started_routines_str: string; 
  public nb_completed_routines: number; //only since opening of browser
  //saved as
  nb_completed_routines_str: string;
  
  currentUser: User;
  temp:string[];
  checking$: Subject<boolean> = new Subject();
  periodic:Subscription;

   constructor(private botRequestService: BotRequestService,
               private authenticationService: AuthenticationService,
               private alertService: AlertService
   ) {
   this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   this.get_local();
   }
    
  startChecking() {
    console.log("checking set to true");
    this.checking$.next(true);
  }

  stopChecking() {
    console.log("checking set to false");
    this.checking$.next(false);
  }
  
  get_status(routine: string){
    //init
    this.running_rq=[]; 
    this.running_routine=[]; 
  
    this.botRequestService.getRq(routine,this.currentUser.id) 
    .subscribe(
          rqs => {
          rqs.forEach(rq=>{
            if (rq.status =="started"){ 
                 this.running_rq.push(rq.id);
                 this.running_routine.push(routine);
            }
        })
    })
  }
  
  reset(){
    this.nb_started_routines=0;
    this.nb_completed_routines=0;
    this.running_routine=[];
    this.running_rq=[];
    this.save_local();
  }
  
  start(routine: string){
    this.get_status(routine);
    this.nb_started_routines=this.nb_started_routines+1;
    this.startChecking();
    this.save_local();
  }
  //this.periodic_check(); //started from topbar
  
  remove(routine: string, rq: BotRequest,success: boolean){
    if (success){
        this.event_completed(routine);
    }
    else{
        this.event_failed(routine);
    }
    
    this.nb_completed_routines=this.nb_completed_routines+1;
    const index =this.running_rq.indexOf(rq.id, 0);
    if (index > -1) {
       this.running_rq.splice(index, 1);
    }
    
    const index2 =this.running_routine.indexOf(routine, 0);
    if (index2 > -1) {
       this.running_routine.splice(index2, 1);
    } 

    if (this.running_rq.length==0){
        this.stopChecking();
    }
    this.save_local();
  }
  
  unique(routine_array: string[]){
    var res_array: string[];
    res_array=[];
  
    for (var item of routine_array){
        if (res_array.includes(item)==false){
            res_array.push(item);
        }
    }
    return res_array;
  }
  
  event_completed(routine: string){
      this.alertService.success("request " + dic_of_routines[routine] + " completed");
  }
  
  event_failed(routine: string){
      this.alertService.error("request " + dic_of_routines[routine] + " failed");
  }
 
  //called from topbar
  periodic_check(){
      this.checking$.subscribe(
      (checking: boolean) => {
              if (checking){
                 this.periodic=IntervalObservable.create(30000) //30 s
                      .subscribe(
                          data => {
                          this.check();
                          }
              )}
              else{
                 if(this.periodic){
                    this.periodic.unsubscribe();  //stop
                 }
              }
          }
      )
  }
  
  check() {
    if (this.running_routine){
        //console.log("checking data");
        let res_array=this.unique(this.running_routine);
    
        for (var routine of res_array){
             this.botRequestService.getRq(routine,this.currentUser.id)
              .subscribe(
              rqs => {
              rqs.forEach(rq=>{
                     if (this.running_rq.includes(rq.id)){ 
                         if (rq.status =="completed"){ 
                             this.remove(rq.routine,rq,true);
                        }
                         else if(rq.status =="failed"){ 
                             this.remove(rq.routine,rq,false);
                         }
                     }
              })
           })
          }
   }
   else{
         console.log("no routine to check!");
   }
  }

  save_local(){
      localStorage.setItem('NB_STARTED_ROUTINES', this.nb_started_routines.toString());
      localStorage.setItem('NB_COMPLETED_ROUTINES', this.nb_completed_routines.toString());
      localStorage.setItem('STARTED_ROUTINES', this.running_routine.join(","));
      localStorage.setItem('STARTED_ROUTINES_ID', this.running_rq.join(","));
  }
  
  get_local(){
      this.nb_started_routines_str=localStorage.getItem('NB_STARTED_ROUTINES');
      this.nb_completed_routines_str=localStorage.getItem('NB_COMPLETED_ROUTINES');
      //this.checking_str=localStorage.getItem('CHECKING');
      this.started_routines_str=localStorage.getItem('STARTED_ROUTINES');
      this.started_routines_id_str=localStorage.getItem('STARTED_ROUTINES_ID');
      
      if (!this.nb_started_routines_str){
          this.nb_started_routines=0;
      }
      else{
          this.nb_started_routines=parseInt(this.nb_started_routines_str);
      }
      
      if (!this.nb_completed_routines_str){
          this.nb_completed_routines=0;
      }
      else{
          this.nb_completed_routines=parseInt(this.nb_completed_routines_str);
      }
      
      if (!this.started_routines_str){
          this.running_routine=[]; 
      }
      else{
          this.running_routine=this.started_routines_str.split(",");
      }
      
      if (!this.started_routines_id_str){
          this.running_rq=[]; 
      }
      else{
         this.temp=this.started_routines_id_str.split(",");
         this.running_rq=[];
          
         for(var i=0; i<this.temp.length;i++) {
             this.running_rq.push(parseInt(this.temp[i]));
         }
      }
      
  }
  
}