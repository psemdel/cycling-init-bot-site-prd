import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';
import { BotRequest, User} from '@app/models/models';

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

  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private monitoringService: MonitoringService
    ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
              this.years = Array(30).fill(0).map((x,i)=>2000+i);
   }

  ngOnInit() {
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            year: [2021, Validators.required],
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
        error => {
                console.log(error);
        }
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
        data => {
          console.log('national all champs request success');
          this.success = true;
          this.monitoringService.start('national_all_champs');
        },
        error => {
            console.log(error);
        });
     this.botrequest = new BotRequest();
  }
}
