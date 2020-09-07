import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';
import { BotRequest, User} from '@app/models/models';
import { nationalities,  categories} from '@app/models/lists';

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
            year_begin: ['', Validators.required],
            year_end: ['', [Validators.required]],
            nationality: ['', Validators.required],
            category: ['', Validators.required],
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
    this.botRequestService.createRq('national_one_champ',this.botrequest)
      .subscribe(
        data => {
          console.log('national one champ request success');
          this.success = true;
          this.monitoringService.start('national_one_champ');
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
