import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MonitoringService } from '../services/monitoring.service';

import { User} from '../models/models';
import {AuthenticationService } from '../services/authentication.service';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-menu-pers',
  templateUrl: './menupers.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [
    MatMenuModule, 
    MatIconModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule
]
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