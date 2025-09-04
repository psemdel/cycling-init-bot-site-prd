import { Component, OnInit} from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';

import { BotRequest, User} from '../models/models';
import { race_types, yesnos,  gendersExtended,unknown} from '../models/lists';

@Component({
  selector: 'final-result',
  templateUrl: './final-result.component.html',
  styleUrls: ['./final-result.component.css'],
})

export class FinalResultComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  submitted = false;
  success = false;
  lastname: string;
  yesnos=yesnos;
  race_types=race_types;
  genders=gendersExtended;
  years:Array<any> = [];
  init_year: Number;
  unknown=unknown;

  botrequest: BotRequest = new BotRequest();

  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder, 
              private authenticationService: AuthenticationService,
              private monitoringService: MonitoringService
  ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }
   
  ngOnInit() {
        this.lastname="";
        this.init_year=new Date().getFullYear();
        this.registerForm = this.formBuilder.group({
            item_id: ['', [Validators.required, Validators.pattern(/^[Q].*$/)]],
            force_nation_team: [false, Validators.required],
            gender: [null],
            fc_id: [0, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
            add_unknown_rider: [false, Validators.required],
            });
  }
  
  get f() { return this.registerForm.controls; }

  newRequest(): void {
    this.submitted = false;
    this.success=false;
    this.botrequest = new BotRequest();
  }
  
  onSubmit() {
    //reinit
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
    this.botrequest.fc_id=this.f.fc_id.value;

    this.save();
  }

  save() {
      this.botRequestService.createRq('final_result',this.botrequest)
        .subscribe(
          (data : any) => {
            console.log('final result request success');
            this.success = true;
            this.monitoringService.start('final_result');
          },
          (error : any) => {
              console.log(error);
          });
       this.botrequest = new BotRequest();
    }

}

