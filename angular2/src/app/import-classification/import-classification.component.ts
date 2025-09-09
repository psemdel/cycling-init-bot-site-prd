import { Component, OnInit} from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

import { HttpClient} from '@angular/common/http';

//import {FileUploadService} from '../services/file-upload.service';
import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';

import { BotRequest, User, FileUploadModel} from '../models/models';
import {FuncsService} from '../models/functions';

import { environment } from '../../environments/environment';

interface ClassificationType {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'import-classification',
  templateUrl: './import-classification.component.html',
  styleUrls: ['./import-classification.component.css'],
  imports: [MatInputModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule],
})

export class ImportClassificationComponent implements OnInit {
  currentUser: User | null;
  registerForm: FormGroup;
  submitted = false;
  success = false;
  lastname: string;
  years:Array<any> = [];
  init_year: Number;

  botrequest: BotRequest = new BotRequest();
  files: Array<FileUploadModel> = [];
  private baseUrl = environment.apiUrl +'bot_requests';

  exterror=false;
  sizeerror=false;
 
  classification_types: ClassificationType[] = [
    {value: 9, viewValue: 'All (only for fc, not file import)'},  
    {value: 0, viewValue: 'General'},
    {value: 1, viewValue: 'Stage classification'},
    {value: 2, viewValue: 'Points'},
    {value: 3, viewValue: 'Mountain'},  
    {value: 8, viewValue: 'Sprints'},  
    {value: 4, viewValue: 'Youth by time'},
    {value: 7, viewValue: 'Youth by points'},    
    {value: 5, viewValue: 'Team by time'}, 
    {value: 6, viewValue: 'Team by points'},             
  ];

  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder, 
              private authenticationService: AuthenticationService,
              private http: HttpClient,
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
            item_id: ['', [Validators.required, Validators.pattern(/^[Q].*$/)]],
            classification_type: [9, Validators.required],
            file: [null],
            fc_id: [0, [Validators.pattern(/^[0-9]*$/)]],
            stage_num: [-1, [Validators.pattern(/^-?[0-9]*$/)]],
            year: [this.init_year, Validators.required],
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
    this.files=[]; //new
    // stop here if form is invalid
    if (this.registerForm.invalid) {
       console.log("input not valid")
       return;
    }
       
    //display in the interface
    this.lastname=this.f.item_id.value;  
    this.botrequest=this.funcs.copy_from_to_bot_request(this.registerForm,this.botrequest, this.currentUser)
    this.botrequest = new BotRequest();

 //   this.save();
  }
}

