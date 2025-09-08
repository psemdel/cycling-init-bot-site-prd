import { Component, OnInit } from '@angular/core';
import {AuthenticationService } from '../services/authentication.service';
import { User} from '../models/models';

import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [MatIconModule, MatMenuModule]
})
export class MenuComponent implements OnInit {
  currentUser: User;
    
  constructor(private authenticationService: AuthenticationService,
  ) { 
   this.authenticationService.currentUser.subscribe({next: (x :any) => this.currentUser =  x});
  }

  ngOnInit() {
  }

}