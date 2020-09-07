import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';
import { BotRequest, User} from '@app/models/models';

interface Property {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'sort-date',
  templateUrl: './sort-date.component.html',
  styleUrls: ['./sort-date.component.css']
})

export class SortDateComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  
  properties: Property[] = [
    {value: 527, viewValue: 'has part (P527)'},
    {value: 2522, viewValue: 'victory (P2522)'},
  ];
  
  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private monitoringService: MonitoringService
    ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }

  ngOnInit() {
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            item_id: ['', [Validators.required, Validators.pattern(/^[Q].*$/)]],
            prop: ['', Validators.required],
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
    this.lastname=this.f.item_id.value;  

    Object.keys(this.registerForm.controls).forEach(key => {
      this.botrequest[key]=this.registerForm.controls[key].value;
    });

    this.botrequest.author=this.currentUser.id;
    this.save();
  }

  save() {
    this.botRequestService.createRq('sort_date',this.botrequest)
      .subscribe(
        data => {
          console.log('creater date sorting request success');
          this.success = true;
          this.monitoringService.start('sort_date');
        },
        error => {
            console.log(error);
        });
     this.botrequest = new BotRequest();
        
  }


}
