import { Component, OnInit} from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import {FuncsService} from '../models/functions';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import { BotRequest, User} from '../models/models';
import { race_types, yesnos,  gendersExtended,unknown} from '../models/lists';

@Component({
  selector: 'update-result',
  templateUrl: './update-result.component.html',
  styleUrls: ['./update-result.component.css'],
  imports: [MatFormFieldModule, MatSelectModule],
})

export class UpdateResultComponent implements OnInit {
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
              private monitoringService: MonitoringService,
              private funcs: FuncsService
  ) { 
              this.authenticationService.currentUser.subscribe((x : any) => this.currentUser = x);
   }
   
  ngOnInit() {
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            item_id: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[Q].*$/)]),
            force_nation_team: this.formBuilder.control(false, [Validators.required]),
            fc_id: this.formBuilder.control(0, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
            add_unknown_rider: this.formBuilder.control(false, [Validators.required]),
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
    this.botrequest=this.funcs.copy_from_to_bot_request(this.registerForm,this.botrequest, this.currentUser)
    this.botrequest.fc_id=this.f.fc_id.value;

    this.save();
  }

  save() {
      this.botRequestService.createRq('update_result',this.botrequest)
        .subscribe({
          next: (data : any) => {
            console.log('update result request success');
            this.success = true;
            this.monitoringService.start('update_result');
          },
          error: (error : any) => {
              console.log(error);
          }
        });
       this.botrequest = new BotRequest();
    }

}

