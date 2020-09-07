import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';
import { BotRequest, User} from '@app/models/models';
import { race_types, nationalities,yesnos,race_1x_classes, race_2x_classes} from '@app/models/lists';

import { MY_FORMATS} from '@app/models/date-format';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css'],
  providers: [
  {provide: MAT_DATE_LOCALE, useValue: 'fr'},
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class RaceComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  botrequest: BotRequest = new BotRequest();
  submitted = false;
  success = false;
  lastname: string;
  nationalities= nationalities;
  race_types=race_types;
  race_1x_classes=race_1x_classes;
  race_2x_classes=race_2x_classes;
  yesnos=yesnos;
  temp1: boolean;
  temp2: string;
  
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
            name: ['', Validators.required],
            item_id: ['', [Validators.required, Validators.pattern(/^[Q].*$/)]],
            nationality: ['', Validators.required],
            time_of_race: ['', Validators.required],
            end_of_race: [''],
            race_type: [true, Validators.required],
            race_class1: ['',],
            race_class2: [''],
            edition_nr: [''],
            create_stages: [true],
            prologue: [true],
            last_stage: [0],
    
            });
            
        this.registerForm.get('race_type').valueChanges
            .subscribe(value => this.onRaceTypeChanged());    
            
        this.registerForm.get('create_stages').valueChanges
            .subscribe(value => this.onCreateStageChanged());        
            
  }
  
  onRaceTypeChanged()
  {
      if (this.registerForm.value.race_type){ //stage
          this.registerForm.controls.race_class2.setValidators(Validators.required);
          this.registerForm.controls.race_class1.setValidators(null);
          this.registerForm.controls.end_of_race.setValidators(Validators.required);
      }
      else
      {   
          this.registerForm.controls.race_class1.setValidators(Validators.required);
          this.registerForm.controls.race_class2.setValidators(null);
          this.registerForm.controls.end_of_race.setValidators(null);
      }
  }
 
  onCreateStageChanged()
  {
      if (this.registerForm.value.create_stages){ //stage
          this.registerForm.controls.last_stage.setValidators(Validators.required);
      }
      else
      {   
          this.registerForm.controls.last_stage.setValidators(null);
      }
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
    
    this.botrequest.name=this.f.name.value;
    this.botrequest.item_id=this.f.item_id.value;
    this.botrequest.nationality=this.f.nationality.value;
    this.botrequest.time_of_race=this.f.time_of_race.value;
    this.botrequest.race_type=this.f.race_type.value;
    this.botrequest.edition_nr=this.f.edition_nr.value;
    
    if (this.registerForm.value.race_type=='true')
    {
        this.botrequest.end_of_race=this.f.end_of_race.value;
        this.botrequest.race_class=this.f.race_class2.value;
        this.botrequest.prologue=this.f.prologue.value;
        this.botrequest.last_stage=this.f.last_stage.value;
        this.botrequest.create_stages=this.f.create_stages.value;
    }
    else
    {
        this.botrequest.race_class=this.f.race_class1.value;
        this.botrequest.create_stages=false;
        this.botrequest.prologue=false;
        this.botrequest.last_stage=1;
     }

    this.botrequest.author=this.currentUser.id;
    this.save();
  }

  save() {
    this.botRequestService.createRq('race',this.botrequest)
      .subscribe(
        data => {
          console.log('creater race request success');
          this.success = true;
          this.monitoringService.start('race');
        },
        error => {
            console.log(error);
        });
     this.botrequest = new BotRequest();
        
  }


}
