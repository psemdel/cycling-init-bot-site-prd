import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '@app/services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';
import { BotRequest, User} from '@app/models/models';
import { nationalities, categories} from '@app/models/lists';

@Component({
  selector: 'national-team',
  templateUrl: './national-team.component.html',
  styleUrls: ['./national-team.component.css']
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
              private monitoringService: MonitoringService
    ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
              this.years = Array(80).fill(0).map((x,i)=>2030-i);
   }

  ngOnInit() {
        this.lastname="";
        this.init_year=new Date().getFullYear();
        this.registerForm = this.formBuilder.group({
            year_begin: [this.init_year, Validators.required],
            year_end: [this.init_year, [Validators.required]],
            nationality: ['', Validators.required],
            category: ['woman', Validators.required],
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
        error => {
                console.log(error);
        }
       return;
    }
    //display in the interface
    this.lastname=this.f.nationality.value;  
    
    Object.keys(this.registerForm.controls).forEach(key => {
      this.botrequest[key]=this.registerForm.controls[key].value;
    });

    this.botrequest.author=this.currentUser.id;
    this.save();
  }

  save() {
    this.botRequestService.createRq('national_team',this.botrequest)
      .subscribe(
        data => {
          console.log('creater national team request success');
          this.success = true;
          this.monitoringService.start('national_team');
        },
        error => {
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
