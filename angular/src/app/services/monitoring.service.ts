import { Injectable } from '@angular/core';
import { BotRequestService} from './bot-request.service';
import { Subject, Subscription, Observable, forkJoin } from 'rxjs';

import {AuthenticationService } from './authentication.service';
import {AlertService } from './alert.service';

import {BotRequest, User} from '../models/models';
import {all_routines, dic_of_routines, dic_of_display_alert} from '../models/lists';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService    {
  running_rq: number[]=[] ; //list of all running rq
  running_rq_o: Subject<(number)[]> = new Subject();
  running_routine: string[]=[];

  public nb_started_routines: number =0; //only since opening of browser
  //saved as
  public nb_completed_routines: number=0; //only since opening of browser
  
  currentUser: User|null;
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
    this.checking$.next(true);
  }

  stopChecking() {
    this.checking$.next(false);
  }
  //
  get_status(): Observable<number[]>
  {  //check running rq, without a priori
    //init
    this.running_rq=[]; 
    this.running_routine=[];
    let observables: Observable<any>[] = []; 
    let currentUser = this.currentUser;
    let cId=0
    if (currentUser !== null){
        cId=currentUser.id;
    }

    if (this.nb_started_routines==0){ //after reset
        var resetted=true;
    } else{
        var resetted=false;
    }

    for (var routine of all_routines){
        observables.push(
            this.botRequestService.getRq(routine,cId)
            .pipe(map(rqs =>{
                rqs.forEach(rq =>{
                    if (rq.status =="started" || rq.status =="pending"){ 
                        this.running_rq.push(rq.id);
                        console.log("this.running_rq is "+ this.running_rq)
                        this.running_routine.push(rq.routine);
                        if (resetted){
                            this.nb_started_routines+=1;
                        }
                    }
            })
        })
        ))
    }
    return forkJoin(observables) //wait that everything is finished before going forward
  }

  reset(){
    this.nb_started_routines=0;
    this.nb_completed_routines=0;
    this.running_routine=[];
    this.running_rq=[];
    this.save_local();
  }
  
  start(routine: string){
    this.nb_started_routines+=1;  
    this.startChecking();
    this.get_status().subscribe(
        fork => this.save_local()
        );
  }
  //this.periodic_check(); //started from topbar
  
  remove(routine: string, rq: BotRequest,success: boolean){
    if (success){
        this.event_completed(routine, rq);
    }
    else{
        this.event_failed(routine);
    }
 
    this.get_status()
    .subscribe(
        fork=>{
        if (this.running_rq.length==0){
            this.stopChecking();
        }
        this.nb_completed_routines=this.nb_started_routines-this.running_rq.length; //ensure consistency
        this.save_local();
        }
    )
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
  
  event_completed(routine: string, rq: BotRequest){
      var sup_info: string="";

      switch(dic_of_display_alert[routine]){
        case "name only": {sup_info="name: "+rq.name; break;}
        case "name": {sup_info="name: "+rq.name + " " + rq.year; break;}
        case "id":{sup_info="id: "+rq.result_id; break;}
        case "origin_id":{sup_info="id: "+rq.item_id; break;}
        case "year": {sup_info="year: "+rq.year; break;}
        case "year_begin": {sup_info="start year: "+rq.year_begin; break;}
        case "name_and_id":{sup_info="name: "+rq.name + ", id: "+rq.result_id; break;}
       }
      
      this.alertService.success("request " + dic_of_routines[routine]  + " completed" + ", " + sup_info);
  }
  
  event_failed(routine: string){
      this.alertService.error("request " + dic_of_routines[routine] + " failed");
  }
 
  //called from topbar
  periodic_check(){
      this.checking$.subscribe(
      (checking: boolean) => {
              if (checking){
                 this.periodic=interval(30000) //30 s
                      .subscribe(
                          (data: any) => {
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
        let res_array=this.unique(this.running_routine);
        
        for (var routine of res_array){
             let currentUser = this.currentUser;
             if (currentUser!==null){
             this.botRequestService.getRq(routine,currentUser.id)
                    .subscribe(
                    (rqs: any) => {
                    rqs.forEach((rq: any)=>{
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
   }
   else{
         console.log("no routine to check!");
   }
  }

  save_local(){
    console.log("this.running_rq before saving "+ this.running_rq)
      localStorage.setItem('NB_STARTED_ROUTINES', this.nb_started_routines.toString());
      localStorage.setItem('NB_COMPLETED_ROUTINES', this.nb_completed_routines.toString());
      localStorage.setItem('STARTED_ROUTINES', this.running_routine.join(","));
      localStorage.setItem('STARTED_ROUTINES_ID', this.running_rq.join(","));
  }
  
  get_local(){
      let nb_started_routines_str_raw=localStorage.getItem('NB_STARTED_ROUTINES');
      if (nb_started_routines_str_raw!==null){
        this.nb_started_routines=parseInt(nb_started_routines_str_raw);
      }
      else{
        this.nb_started_routines=0
      }

      let nb_completed_routines_str_raw=localStorage.getItem('NB_COMPLETED_ROUTINES');
      if (nb_completed_routines_str_raw!==null){
        this.nb_completed_routines=parseInt(nb_completed_routines_str_raw);
      }
      else{
         this.nb_completed_routines=0
      }

      let started_routines_str_raw=localStorage.getItem('STARTED_ROUTINES');
      if (started_routines_str_raw!==null){
        this.running_routine=started_routines_str_raw.split(",");
        console.log(this.running_routine)
        }
      else{
         this.running_routine=[]; 
      }
      
      let started_routines_id_str_raw=localStorage.getItem('STARTED_ROUTINES_ID');
      if (started_routines_id_str_raw!==null){
        this.temp=started_routines_id_str_raw.split(",");
         this.running_rq=[];
          
         for(var i=0; i<this.temp.length;i++) {
            this.running_rq.push(parseInt(this.temp[i]));
         }
         console.log("this.running_rq after parsing from local " + this.running_rq)
      }
      else{
         this.running_rq=[]; 
      }

      this.get_status().subscribe(
        fork => this.save_local()
        );
     //without a priori 
  }
  
}