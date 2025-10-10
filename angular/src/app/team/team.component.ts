import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {FuncsService} from '../models/functions';
import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import { BotRequest, User} from '../models/models';
import { nationalities, teamCategories} from '../models/lists';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  imports : [
    MatFormFieldModule, 
    MatSelectModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatInputModule,
    MatButtonModule
  ]

})

export class TeamComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  years:Array<any> = [];
  nationalities= nationalities;
  teamCategories=teamCategories;
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
            name: this.formBuilder.control('', [Validators.required]),
            item_id: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[Q].*$/)]),
            year: this.formBuilder.control(this.init_year, [Validators.required]),
            UCIcode: this.formBuilder.control(''), //pattern
            nationality: this.formBuilder.control('', [Validators.required]),  
            category_id: this.formBuilder.control('Q6154783', [Validators.required]),
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
    this.lastname=this.f.name.value;  
    this.botrequest=this.funcs.copy_from_to_bot_request(this.registerForm,this.botrequest, this.currentUser)
    this.save();
  }

  save() {
    this.botRequestService.createRq('team',this.botrequest)
      .subscribe({
        next: (data : any) => {
          console.log('creater team request success');
          this.success = true;
          this.monitoringService.start('team');
        },
        error: (error : any) => {
            console.log(error);
        }
    });
      this.botrequest = new BotRequest();
    }
}


