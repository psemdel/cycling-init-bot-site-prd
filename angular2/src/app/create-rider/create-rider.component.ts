import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import {AlertService} from '../services/alert.service';
import { BotRequest, User} from '../models/models';
import { nationalities, genders} from '../models/lists';

@Component({
  selector: 'app-create-rider',
  templateUrl: './create-rider.component.html',
  styleUrls: ['./create-rider.component.css']
})

export class CreateRiderComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  nationalities= nationalities;
  genders=genders;
    
  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private monitoringService: MonitoringService
    ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }

  ngOnInit() {
        this.alertService.clear()
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            gender: ['', Validators.required],
            nationality: ['', Validators.required],
            });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        console.log("input not valid")
        (error : any) => {
                console.log(error);
        }
       return;
    }
    //display in the interface
    this.lastname=this.f.name.value;  
    
    Object.keys(this.registerForm.controls).forEach(key => {
      this.botrequest[key]=this.registerForm.controls[key].value;
    });
    
    this.botrequest.author=this.currentUser.id;
    this.save();
  }

  save() {
    this.botRequestService.createRq('create_rider',this.botrequest)
      .subscribe(
        (data : any) => {
          console.log('creater rider request success');
          this.success = true;
          this.monitoringService.start('create_rider');
        },
        (error : any) => {
            console.log(error);
        });
     this.botrequest = new BotRequest();
        
  }


}
