import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MonitoringService } from '../services/monitoring.service';

import { User} from '../models/models';
import {AuthenticationService } from '../services/authentication.service';

import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-menu-pers',
  templateUrl: './menupers.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [MatMenuModule]
})

export class MenuPersComponent implements OnInit {
    currentUser: User;
    
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private monitoringService: MonitoringService
    ) {
        this.authenticationService.currentUser.subscribe((x:any) => this.currentUser = x);
    }

  ngOnInit() {
  }
 
  logout() {
     this.monitoringService.reset(); //has to be here to avoid interdependency
     this.authenticationService.logout();
     this.router.navigate(['/login']);
  }
  
}