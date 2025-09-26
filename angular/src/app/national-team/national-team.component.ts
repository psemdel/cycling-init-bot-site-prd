import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import { BotRequest, User} from '../models/models';
import { nationalities, categories} from '../models/lists';

import {FuncsService} from '../models/functions';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'national-team',
  templateUrl: './national-team.component.html',
  styleUrls: ['./national-team.component.css'],
  imports : [
    MatFormFieldModule, 
    MatSelectModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatButtonModule
  ]
})

export class NationalTeamComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  years:Array<any> = [];
  nationalities= nationalities;
  categories=categories; //was gender in the beginning
  init_year: Number;

  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private monitoringService: MonitoringService,
              private funcs: FuncsService
    ) { 
              this.authenticationService.currentUser.subscribe((x : any) => this.currentUser = x);
              this.years = Array(80).fill(0).map((x,i)=>1950+i);
   }

  ngOnInit() {
        this.lastname="";
        this.init_year=new Date().getFullYear();
        this.registerForm = this.formBuilder.group({
            year_begin: this.formBuilder.control(this.init_year, [Validators.required]),
            year_end: this.formBuilder.control(this.init_year, [Validators.required]),
            nationality: this.formBuilder.control('', [Validators.required]),
            category: this.formBuilder.control('woman', [Validators.required]),
            },{validators: this.funcs.checkYear});
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
    this.lastname=this.f.nationality.value;  
    this.botrequest=this.funcs.copy_from_to_bot_request(this.registerForm,this.botrequest, this.currentUser)
    this.save();
  }

  save() {
    this.botRequestService.createRq('national_team',this.botrequest)
      .subscribe({
        next: (data : any) => {
          console.log('creater national team request success');
          this.success = true;
          this.monitoringService.start('national_team');
        },
        error: (error : any) => {
            console.log(error);
        }
    });
    this.botrequest = new BotRequest();
    }
}
