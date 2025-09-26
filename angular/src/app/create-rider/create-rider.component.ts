import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import {AlertService} from '../services/alert.service';
import { BotRequest, User} from '../models/models';
import { nationalities, genders} from '../models/lists';
import {FuncsService} from '../models/functions';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-create-rider',
  templateUrl: './create-rider.component.html',
  styleUrls: ['./create-rider.component.css'],
  imports : [
    MatFormFieldModule, 
    MatSelectModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatButtonModule,
    MatInputModule
  ]
})

export class CreateRiderComponent implements OnInit {
  currentUser: User | null;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  nationalities= nationalities;
  genders=genders;
    
  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private monitoringService: MonitoringService,
              private funcs: FuncsService
    ) { 
              this.authenticationService.currentUser.subscribe((x : any) => this.currentUser = x);
   }

  ngOnInit() {
        this.alertService.clear()
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            gender: ['', Validators.required],
            nationality: ['', Validators.required],
            });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
       console.log("input not valid")
       return;
    }
    //display in the interface
    this.lastname=this.f.name.value;  
    this.botrequest=this.funcs.copy_from_to_bot_request(this.registerForm,this.botrequest, this.currentUser)
    this.save();
  }

  save() {
    this.botRequestService.createRq('create_rider',this.botrequest)
      .subscribe({
          next: (data : any) => {
              console.log('creater rider request success');
              this.success = true;
              this.monitoringService.start('create_rider');
            },
          error: (error : any) => {
                console.log(error);
            }
        });
     this.botrequest = new BotRequest();
        
  }


}
