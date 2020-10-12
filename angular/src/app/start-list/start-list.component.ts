import { Component, OnInit} from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { HttpClient, HttpResponse, HttpRequest, 
         HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { catchError, last, map, tap } from 'rxjs/operators';

import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';

import { BotRequest, User,FileUploadModel} from '@app/models/models';
import { race_types, yesnos,  genders} from '@app/models/lists';

import { environment } from '@env/environment';

import { MY_FORMATS} from '@app/models/date-format';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


interface Moment {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'start-list',
  templateUrl: './start-list.component.html',
  styleUrls: ['./start-list.component.css'],
  providers: [
  {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  animations: [
            trigger('fadeInOut', [
                  state('in', style({ opacity: 100 })),
                  transition('* => void', [
                        animate(300, style({ opacity: 0 }))
                  ])
           ])
      ]
})

export class StartListComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  submitted = false;
  success = false;
  lastname: string;
  yesnos=yesnos;
  race_types=race_types;
  genders=genders;
  
  botrequest: BotRequest = new BotRequest();
  files: Array<FileUploadModel> = [];
  private baseUrl = environment.apiUrl +'bot_requests';
  
  exterror=false;
  sizeerror=false;
   
  moments: Moment[] = [
    {value: false, viewValue: 'First stage/prologue'},
    {value: true, viewValue: 'End stage'},
  ];

  constructor(private botRequestService: BotRequestService,
              private formBuilder: FormBuilder, 
              private authenticationService: AuthenticationService,
              private http: HttpClient,
              private monitoringService: MonitoringService
  ) { 
              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }
   
  ngOnInit() {
        this.lastname="";
        let d: Date = new Date();
        this.registerForm = this.formBuilder.group({
            item_id: ['', [Validators.required, Validators.pattern(/^[Q].*$/)]],
            race_type: [false, Validators.required],
            time_of_race: [{date: {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()}}, Validators.required],
            moment: [false],
            chrono: [false, Validators.required],
            force_nation_team: [false, Validators.required],
            gender: ['',Validators.required],
            file: [null, Validators.required]
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
        error => {
                console.log(error);
        }
       return;
    }
    
     const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
     if (!this.validateFile(fileUpload.files[0].name)) { //name
        console.log('Selected file format is not supported');
        this.exterror=true;
        return;
     }
     
     if (fileUpload.files[0].size>2000000) {
        console.log('File size exceeded');
        this.sizeerror=true;
        return;
     }
     
     for (let index = 0; index < fileUpload.files.length; index++) {
              const file = fileUpload.files[index];
              this.files.push({ data: file, state: 'in', 
                inProgress: false, progress: 0, canRetry: false, canCancel: true,
                author: this.currentUser.id
                 });
     }

    //display in the interface
    this.lastname=this.f.item_id.value;  
    
    Object.keys(this.registerForm.controls).forEach(key => {
      this.botrequest[key]=this.registerForm.controls[key].value;
    });
    
    this.botrequest.author=this.currentUser.id;
    
    this.uploadFile(this.files[0], this.botrequest);
    this.botrequest = new BotRequest();
 //   this.save();
  }

   private uploadFile(file: FileUploadModel, botrequest: BotRequest) {
            const fd = new FormData();
            fd.append('file', file.data);
            fd.append('botrequest',JSON.stringify(botrequest))

            const req = new HttpRequest('POST',  `${this.baseUrl}/create_file/start_list/`, fd, {
                  reportProgress: true
            });

            file.inProgress = true;
            file.sub = this.http.request(req).pipe(
                  map(event => {
                        switch (event.type) {
                              case HttpEventType.UploadProgress:
                                    file.progress = Math.round(event.loaded * 100 / event.total);
                                    break;
                              case HttpEventType.Response:
                                    return event;
                        }
                  }),
                  tap(message => { }),
                  last(),
                  catchError((error: HttpErrorResponse) => {
                        file.inProgress = false;
                        file.canRetry = true;
                        return of(`${file.data.name} upload failed.`);
                  })
            ).subscribe(
                  (event: any) => {
                        if (typeof (event) === 'object') {
                            console.log("upload successful!")
                            this.success=true;
                            this.monitoringService.start('start_list');
                        }
                  }
            );
      }
      
    private validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'csv' || ext.toLowerCase() == 'xlsx') {
            return true;
        }
        else {
            return false;
        }
    }
}

