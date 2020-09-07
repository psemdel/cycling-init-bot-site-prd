import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MonitoringService } from '@ser/monitoring.service';

import { User} from '@app/models/models';
import {AuthenticationService } from '@ser/authentication.service';

@Component({
  selector: 'app-menu-pers',
  templateUrl: './menupers.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuPersComponent implements OnInit {
    currentUser: User;
    
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private monitoringService: MonitoringService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit() {
  }
 
  logout() {
     this.monitoringService.reset(); //has to be here to avoid interdependency
     this.authenticationService.logout();
     this.router.navigate(['/login']);
  }
  
}