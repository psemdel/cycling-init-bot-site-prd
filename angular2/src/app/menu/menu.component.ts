import { Component, OnInit } from '@angular/core';
import {AuthenticationService } from '../services/authentication.service';
import { User} from '../models/models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  currentUser: User;
    
  constructor(private authenticationService: AuthenticationService,
  ) { 
   this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }

}