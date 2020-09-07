import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '@app/services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';
import { BotRequest, User} from '@app/models/models';
import { nationalities} from '@app/models/lists';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
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
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            item_id: ['', [Validators.required, Validators.pattern(/^[Q].*$/)]],
            year: ['', Validators.required],
            UCIcode: [''], //pattern
            nationality: ['', Validators.required],
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
    this.lastname=this.f.name.value;  
    
    Object.keys(this.registerForm.controls).forEach(key => {
      this.botrequest[key]=this.registerForm.controls[key].value;
    });

    this.botrequest.author=this.currentUser.id;
    this.save();
  }

  save() {
    this.botRequestService.createRq('team',this.botrequest)
      .subscribe(
        data => {
          console.log('creater team request success');
          this.success = true;
          this.monitoringService.start('team');
        },
        error => {
            console.log(error);
        });
     this.botrequest = new BotRequest();
        
  }


}
