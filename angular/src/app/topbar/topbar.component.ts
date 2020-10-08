import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User} from '@app/models/models';
import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})

export class TopbarComponent implements OnInit {
    currentUser: User;
    nb_started_routines: number;
    nb_completed_routines: number;
    periodic_bool=false;
    
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private monitoringService: MonitoringService
    ) {
        this.authenticationService.currentUser.subscribe(x => { 
            this.currentUser = x
            if (x==null){
                this.monitoringService.reset();
            }
        });
    }

  ngOnInit() {
    this.init()
  }
 
 periodic_update(){
     this.periodic_bool=true;
     this.monitoringService.periodic_check();
     IntervalObservable.create(20000)
          .subscribe(
              data => {
              this.init(); //reload nb_started_routines
              })
 }
 
 init(){
      this.nb_started_routines=this.monitoringService.nb_started_routines;
      this.nb_completed_routines=this.monitoringService.nb_completed_routines;
      if (!this.periodic_bool){
          this.periodic_update();
      } //otherwise it starts infinitely
 
 }
}    
