import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {FuncsService} from '../models/functions';

import { BotRequest, User,FileUploadModel} from '../models/models';
import { race_types, yesnos,  gendersExtended,unknown} from '../models/lists';

import { environment } from '../../environments/environment';

import { MY_FORMATS} from '../models/date-format';
import {DateAdapter,MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

interface Moment {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'start-list',
  templateUrl: './start-list.component.html',
  styleUrls: ['./start-list.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, 
  MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },

  ],
  imports: [
    MatFormFieldModule, 
    MatSelectModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatButtonModule
  ]
})

export class StartListComponent implements OnInit {
  currentUser: User | null;
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
  files: Array<FileUploadModel> = [];
  private baseUrl = environment.apiUrl +'bot_requests';
  
  exterror=false;
  sizeerror=false;
   
  moments: Moment[] = [
    {value: false, viewValue: 'First stage/prologue'},
    {value: true, viewValue: 'End stage'},
  ];

  constructor(private formBuilder: FormBuilder, 
              private authenticationService: AuthenticationService,
              private funcs: FuncsService
  ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }
   
  ngOnInit() {
        this.lastname="";
        this.init_year=new Date().getFullYear();
        this.registerForm = this.formBuilder.group({
            item_id: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[Q].*$/)]),
            force_nation_team: this.formBuilder.control(false, [Validators.required]),
            gender: this.formBuilder.control(null),
            file: this.formBuilder.control(null),
            fc_id: this.formBuilder.control(0, [Validators.pattern(/^[0-9]*$/)]),
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
    this.exterror=false;
    this.sizeerror=false;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        console.log("input not valid")
       return;
    }

    //display in the interface
    this.lastname=this.f.item_id.value;  
    this.botrequest=this.funcs.copy_from_to_bot_request(this.registerForm,this.botrequest, this.currentUser)
    this.botrequest.fc_id=this.f.fc_id.value;
    this.botrequest = new BotRequest();
 //   this.save();
  }
 
}

