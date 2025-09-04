import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import { BotRequest, User} from '../models/models';
import { nationalities,  categories} from '../models/lists';

@Component({
  selector: 'national-one-champ',
  templateUrl: './national-one-champ.component.html',
  styleUrls: ['./national-one-champ.component.css']
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
              private monitoringService: MonitoringService
    ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
              this.years = Array(80).fill(0).map((x,i)=>1950+i);
   }

  ngOnInit() {
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            year_begin: this.formBuilder.control(this.init_year, [Validators.required]),
            year_end: this.formBuilder.control(this.init_year, [Validators.required]]),
            nationality: this.formBuilder.control('', Validators.required]),
            category: this.formBuilder.control('', [Validators.required]),
            },{validators: this.checkYear});
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
    
   Object.keys(this.registerForm.controls).forEach((key : any) => {
      this.botrequest[key]=this.registerForm.controls[key].value;
    });

    this.botrequest.author=this.currentUser.id;
    this.save();
  }

  save() {
    this.botRequestService.createRq('national_one_champ',this.botrequest)
      .subscribe(
        (data : any) => {
          console.log('national one champ request success');
          this.success = true;
          this.monitoringService.start('national_one_champ');
        },
        (error : any) => {
            console.log(error);
        });
     this.botrequest = new BotRequest();
  }
  
  checkYear(group: FormGroup) { 
      let year_begin = group.get('year_begin').value;
      let year_end = group.get('year_end').value;
     
      return year_begin <= year_end ? null : { notOk: false }    
    }
}
