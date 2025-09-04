import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import { BotRequest, User} from '../models/models';

@Component({
  selector: 'national-all-champs',
  templateUrl: './national-all-champs.component.html',
  styleUrls: ['./national-all-champs.component.css']
})

export class NationalAllChampsComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  years:Array<any> = [];
  init_year: Number;

  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private monitoringService: MonitoringService
    ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
              this.years = Array(80).fill(0).map((x,i)=>1950+i);
   }

  ngOnInit() {
        this.lastname="";
        this.init_year=new Date().getFullYear();
        this.registerForm = this.formBuilder.group({
            year: [this.init_year, Validators.required],
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
    this.lastname=this.f.year.value;  
    this.botrequest.year=this.f.year.value;
    this.botrequest.author=this.currentUser.id;
    this.save();
  }

  save() {
    this.botRequestService.createRq('national_all_champs',this.botrequest)
      .subscribe(
        (data : any) => {
          console.log('national all champs request success');
          this.success = true;
          this.monitoringService.start('national_all_champs');
        },
        (error : any) => {
            console.log(error);
        });
     this.botrequest = new BotRequest();
  }
}
