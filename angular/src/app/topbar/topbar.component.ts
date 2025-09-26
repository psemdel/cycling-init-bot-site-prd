import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Component, OnInit } from '@angular/core';

import {MenuComponent} from '../menu/menu.component'
import {MenuPersComponent} from '../menupers/menupers.component'
import {RouterLink, RouterLinkActive} from '@angular/router';

import { User} from '../models/models';
import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import { interval } from 'rxjs';



@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
  imports: [
    MatMenuModule, 
    MatIconModule, 
    MenuComponent, 
    MenuPersComponent,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule
]
})

export class TopbarComponent implements OnInit {
    currentUser: User|null;
    nb_started_routines: number;
    nb_completed_routines: number;
    periodic_bool=false;
    
    constructor(
        private authenticationService: AuthenticationService,
        private monitoringService: MonitoringService
    ) {
        this.authenticationService.currentUser.subscribe((x : any) => { 
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
     interval(1000)
          .subscribe(
              (data : any) => {
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

 reset(){
    this.monitoringService.reset();
    this.init();
 }
}    
