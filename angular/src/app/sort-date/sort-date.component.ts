import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {FuncsService} from '../models/functions';

import {MonitoringService } from '../services/monitoring.service';
import { BotRequest, User} from '../models/models';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

interface Property {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'sort-date',
  templateUrl: './sort-date.component.html',
  styleUrls: ['./sort-date.component.css'],
  imports : [
    MatFormFieldModule, 
    MatSelectModule,  
    ReactiveFormsModule, 
    RouterLink,
    MatButtonModule
  ]
})

export class SortDateComponent implements OnInit {
  currentUser: User|null;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  
  properties: Property[] = [
    {value: "P527", viewValue: 'has part (P527)'},
    {value: "P2522", viewValue: 'victory (P2522)'},
  ];
  
  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private monitoringService: MonitoringService,
              private funcs: FuncsService
    ) { 
              this.authenticationService.currentUser.subscribe((x: any) => this.currentUser = x);
   }

  ngOnInit() {
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            item_id: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[Q].*$/)]),
            prop: this.formBuilder.control('', [Validators.required]),
            });
  }

  get f() { return this.registerForm.controls; }

  newRequest(): void {
    this.submitted = false;
    this.success=false;
    this.botrequest = new BotRequest();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        console.log("input not valid")
       return;
    }
    //display in the interface
    this.lastname=this.f.item_id.value;  
    this.botrequest=this.funcs.copy_from_to_bot_request(this.registerForm,this.botrequest, this.currentUser)
    this.save();
  }

  save() {
    this.botRequestService.createRq('sort_date',this.botrequest)
      .subscribe({
      next: (data : any) => {
          console.log('creater date sorting request success');
          this.success = true;
          this.monitoringService.start('sort_date');
        },
      error: (error : any) => {
            console.log(error);
        }
      });
     this.botrequest = new BotRequest();
      }
  }
