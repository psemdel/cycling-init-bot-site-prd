import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {AuthenticationService } from '../services/authentication.service';
import {FuncsService} from '../models/functions';
import { BotRequest, User, FileUploadModel} from '../models/models';
import { genders, yesnos} from '../models/lists';

import { environment } from '../../environments/environment';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'UCIranking',
  templateUrl: './UCIranking.component.html',
  styleUrls: ['./UCIranking.component.css'],
  imports : [
    MatFormFieldModule, 
    MatSelectModule, 
    ReactiveFormsModule, 
    RouterLink, 
    RouterLinkActive,
    MatInputModule,
    MatButtonModule
]
})

export class UCIrankingComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  submitted = false;
  success = false;
  lastname: string;
  years:Array<any> = [];
  genders=genders;
  yesnos=yesnos;
  init_year: Number;
  
  botrequest: BotRequest = new BotRequest();
  files: Array<FileUploadModel> = [];
  private baseUrl = environment.apiUrl +'bot_requests';
  
  exterror=false;
  sizeerror=false;
 
  constructor(
              private formBuilder: FormBuilder, 
              private authenticationService: AuthenticationService,
              private funcs: FuncsService
  ) { 
              this.authenticationService.currentUser.subscribe((x : any) => this.currentUser = x);
              this.years = Array(40).fill(0).map((x,i)=>1994+i);
   }
   
  ngOnInit() {
        this.init_year=new Date().getFullYear();
        this.lastname="";
        this.registerForm = this.formBuilder.group({
            item_id: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[Q].*$/)]),
            year: this.formBuilder.control(this.init_year, [Validators.required]),
            gender: this.formBuilder.control('',[Validators.required]),
            UCIranking: this.formBuilder.control(false,[Validators.required]),
            file: this.formBuilder.control(null, [Validators.required]),
            bypass: this.formBuilder.control(false,[Validators.required]),
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
    this.botrequest = new BotRequest();
 //   this.save();
  }
}

