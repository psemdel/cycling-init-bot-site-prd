import { Component, OnInit} from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { HttpClient, HttpRequest, 
         HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { catchError, last, map, tap } from 'rxjs/operators';

import {AuthenticationService } from '@ser/authentication.service';
import {MonitoringService } from '@ser/monitoring.service';

import { BotRequest, User,FileUploadModel} from '@app/models/models';
import { race_types, yesnos} from '@app/models/lists';

import { environment } from '@env/environment';

import { MY_FORMATS} from '@app/models/date-format';
import {DateAdapter,MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';

interface Moment {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'team-importer',
  templateUrl: './team-importer.component.html',
  styleUrls: ['./team-importer.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, 
  MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
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

export class TeamImporterComponent implements OnInit {
  currentUser: User;
  registerForm: FormGroup;
  submitted = false;
  success = false;
  lastname: string;
  yesnos=yesnos;
  race_types=race_types;
  
  botrequest: BotRequest = new BotRequest();
  files: Array<FileUploadModel> = [];
  private baseUrl = environment.apiUrl +'bot_requests';
  years:Array<any> = [];
  init_year: Number;
  
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
              this.years = Array(30).fill(0).map((x,i)=>2000+i);
   }
   
  ngOnInit() {
        this.lastname="";
        this.init_year=new Date().getFullYear();
        this.registerForm = this.formBuilder.group({
            item_id: ['', [Validators.required, Validators.pattern(/^[Q].*$/)]],
            file: [null],
            fc_id: [0, [Validators.pattern(/^[0-9]*$/)]],
            year: [this.init_year, Validators.required]
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
     if (this.files[0]){
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
      }

    //display in the interface
    this.lastname=this.f.item_id.value;  
    
    Object.keys(this.registerForm.controls).forEach(key => {
      this.botrequest[key]=this.registerForm.controls[key].value;
    });
    
    this.botrequest.author=this.currentUser.id;
    this.botrequest.fc_id=this.f.fc_id.value;
    
    if (this.files[0]){
    this.uploadFile(this.files[0], this.botrequest);
    } else {
      this.botRequestService.createRq('team_importer',this.botrequest)
      .subscribe(
        data => {
          console.log('team importer without file request success');
          this.success = true;
          this.monitoringService.start('team_importer');
        },
        error => {
            console.log(error);
        });
    }

    this.botrequest = new BotRequest();
 //   this.save();
  }

   private uploadFile(file: FileUploadModel, botrequest: BotRequest) {
            const fd = new FormData();
            fd.append('file', file.data);
            fd.append('botrequest',JSON.stringify(botrequest))

            const req = new HttpRequest('POST',  `${this.baseUrl}/create_file/team_importer/`, fd, {
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
                            this.monitoringService.start('team_importer');
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

