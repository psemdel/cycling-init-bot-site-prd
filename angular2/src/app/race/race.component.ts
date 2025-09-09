import { Component, OnInit } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import { BotRequest, User} from '../models/models';
import { race_types, nationalities,yesnos,
race_1x_classes, race_2x_classes,  genders} from '../models/lists';
import { MY_FORMATS} from '../models/date-format';
import {DateAdapter,MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css'],
  providers: [
{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, 
  MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
  imports : [
    MatFormFieldModule, 
    MatSelectModule,  
    ReactiveFormsModule, 
    MatDatepickerModule,
    MatIconModule
  ]
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
  genders=genders;
  yesnos=yesnos;
  temp1: boolean;
  temp2: string;
  datetemp :any;
  datetemp2 :any;
  
  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private monitoringService: MonitoringService
    ) { 
              this.authenticationService.currentUser.subscribe((x : any) => this.currentUser = x);
   }

  ngOnInit() {
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            name: this.formBuilder.control('', [Validators.required]),
            item_id: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[Q].*$/)]),
            nationalities: this.formBuilder.control('', [Validators.required]),
            time_of_race: this.formBuilder.control('', [Validators.required]),
            end_of_race: this.formBuilder.control(''),
            race_types: this.formBuilder.control(false, [Validators.required]),
            race_class1: this.formBuilder.control(''),
            race_class2: this.formBuilder.control(''),
            edition_nr: this.formBuilder.control(''),
            create_stages: this.formBuilder.control(true),
            prologue: this.formBuilder.control(true),
            last_stage: this.formBuilder.control(0),
            gender: this.formBuilder.control('',[Validators.required]),
    
            });

        let race_type=this.registerForm.get('race_type')
        if (race_type!== null){
          race_type.valueChanges
            .subscribe((value : any) => this.onRaceTypeChanged()); 

        }
        
        let create_stage=this.registerForm.get('create_stages')
        if (create_stage!==null){
          create_stage.valueChanges
            .subscribe((value : any) => this.onCreateStageChanged()); 
        }

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
    console.log(this.botrequest.time_of_race);

    this.datetemp=this.f.time_of_race.value;
    this.datetemp2=new Date(this.datetemp);
    this.botrequest.year=this.datetemp2.getFullYear(); //for display in list of requests
    this.botrequest.race_type=this.f.race_type.value;
    this.botrequest.edition_nr=this.f.edition_nr.value;
    this.botrequest.gender=this.f.gender.value;
    
    if (this.registerForm.value.race_type)
    {
      console.log("stage race"); 
        this.botrequest.end_of_race=this.f.end_of_race.value;
        this.botrequest.race_class=this.f.race_class2.value;
        this.botrequest.prologue=this.f.prologue.value;
        this.botrequest.last_stage=this.f.last_stage.value;
        this.botrequest.create_stages=this.f.create_stages.value;
    }
    else
    {
        console.log("single race");
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
      .subscribe({
        next: (data : any) => {
          console.log('creater race request success');
          this.success = true;
          this.monitoringService.start('race');
        },
        error: (error : any) => {
            console.log(error);
        }
      
      });
     this.botrequest = new BotRequest();
        
  }


}
