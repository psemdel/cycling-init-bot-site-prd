import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {FuncsService} from '../models/functions';
import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import { BotRequest, User} from '../models/models';
import {yesnos,  genders} from '../models/lists';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css'],
  imports : [MatFormFieldModule, MatSelectModule, ReactiveFormsModule]
})

export class StagesComponent implements OnInit {
  currentUser: User | null;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  yesnos=yesnos;
  genders=genders;
  
  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private monitoringService: MonitoringService,
              private funcs: FuncsService
    ) { 
              this.authenticationService.currentUser.subscribe((x : any) => this.currentUser = x);
   }

  ngOnInit() {
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            item_id: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[Q].*$/)]),
            prologue: this.formBuilder.control(true, [Validators.required]),
            last_stage: this.formBuilder.control(0, [Validators.required]),
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
    this.botRequestService.createRq('stages',this.botrequest)
      .subscribe({
        next: (data : any) => {
          console.log('creater stages request success');
          this.success = true;
          this.monitoringService.start('stages');
        },
        error: (error : any) => {
            console.log(error);
        }
     });
     this.botrequest = new BotRequest();
        
  }


}
