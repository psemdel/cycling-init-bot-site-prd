import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import {FuncsService} from '../models/functions';
import { BotRequest, User} from '../models/models';
import { nationalities,  categories} from '../models/lists';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'national-one-champ',
  templateUrl: './national-one-champ.component.html',
  styleUrls: ['./national-one-champ.component.css'],
  imports : [MatFormFieldModule, MatSelectModule, ReactiveFormsModule]
})

export class NationalOneChampComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  years:Array<any> = [];
  nationalities= nationalities;
  categories=categories;
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
        this.registerForm = this.formBuilder.group({
            year_begin: this.formBuilder.control(this.init_year, [Validators.required]),
            year_end: this.formBuilder.control(this.init_year, [Validators.required]),
            nationality: this.formBuilder.control('', [Validators.required]),
            category: this.formBuilder.control('', [Validators.required]),
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
    this.lastname=this.f.nationality.value + ' ' + String(this.f.year_begin.value);  
    this.botrequest=this.funcs.copy_from_to_bot_request(this.registerForm,this.botrequest, this.currentUser)
    this.save();
  }

  save() {
    this.botRequestService.createRq('national_one_champ',this.botrequest)
      .subscribe({
        next: (data : any) => {
          console.log('national one champ request success');
          this.success = true;
          this.monitoringService.start('national_one_champ');
        },
        error: (error : any) => {
            console.log(error);
        }
      })
      this.botrequest = new BotRequest();
      }
}
