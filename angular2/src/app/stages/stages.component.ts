import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import { BotRequest, User} from '../models/models';
import {yesnos,  genders} from '../models/lists';

@Component({
  selector: 'stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css']
})

export class StagesComponent implements OnInit {
  currentUser: User;
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
              private monitoringService: MonitoringService
    ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }

  ngOnInit() {
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            item_id: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[Q].*$/)]]),
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

    Object.keys(this.registerForm.controls).forEach(key => {
      this.botrequest[key]=this.registerForm.controls[key].value;
    });

    this.botrequest.author=this.currentUser.id;
    this.save();
  }

  save() {
    this.botRequestService.createRq('stages',this.botrequest)
      .subscribe(
        (data : any) => {
          console.log('creater stages request success');
          this.success = true;
          this.monitoringService.start('stages');
        },
        (error : any) => {
            console.log(error);
        });
     this.botrequest = new BotRequest();
        
  }


}
