import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CreateRiderComponent } from './create-rider.component';
import { FormBuilder } from '@angular/forms';
import {User, BotRequest} from '../models/models';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpResponse} from '@angular/common/http';
import { of } from 'rxjs';


import { BotRequestService} from '../services/bot-request.service';
import {AuthenticationService } from '../services/authentication.service';
import {MonitoringService } from '../services/monitoring.service';
import {AlertService} from '../services/alert.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventEmitter, Injectable, Output } from "@angular/core";


@Injectable()
class MockAuthenticationService {
  currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>; //save other information about user

  constructor() {
        this.currentUserSubject = new BehaviorSubject<User>({"id":1,"username":"tester","password":"","email":"",
    "first_name":"","last_name":"","wiki_name":"","level":false}); 
        this.currentUser = this.currentUserSubject.asObservable();
    }
}

@Injectable()
class MockBotRequestService {
     createRq(routine: string, botrequest: BotRequest){
       return of(new HttpResponse({ status: 200, statusText: "ras"}));
     }
}

describe('CreateRiderComponent', () => {
  let app: CreateRiderComponent;
  let fixture: ComponentFixture<CreateRiderComponent>;
  //let botRequestService: jasmine.SpyObj<BotRequestService>;
  let botRequestService: MockBotRequestService ;
  let monitoringService: jasmine.SpyObj<MonitoringService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let authenticationService: MockAuthenticationService;
  let botrequest = new BotRequest();
  
  beforeEach( async(() => {
  
        //mock services
       // const botRequestService= jasmine.createSpyObj('BotRequestService',['createRq']);
       // const authenticationService= jasmine.createSpyObj('AuthenticationService',['']);
        const alertService= jasmine.createSpyObj('AlertService',['clear']);
        const monitoringService= jasmine.createSpyObj('MonitoringService',['start']);
        const authenticationService=new MockAuthenticationService();
  
        TestBed.configureTestingModule({
          declarations: [
            CreateRiderComponent
          ],
          providers:    [ 
             FormBuilder,
           //   BotRequestService,
             { provide: BotRequestService, useClass: MockBotRequestService  },
             { provide: AuthenticationService, useValue: authenticationService},
             { provide: AlertService, useValue: alertService },
             { provide: MonitoringService, useValue: monitoringService },
        ]
        });

       fixture = TestBed.createComponent(CreateRiderComponent);
       app = fixture.componentInstance;
       
       })
 
  );

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should call alert clear on ngInit', ()=>{
    alertService = TestBed.get(AlertService);
    app.ngOnInit();
    expect(alertService.clear).toHaveBeenCalledTimes(1);
  });
  
  it('should init botrequest', ()=>{
    app.ngOnInit();
    expect(app.botrequest).toBeTruthy();
  });
  
//  it(`save should call botrequest service`, () => {
   // let botRequestService: jasmine.SpyObj<BotRequestService>;
   // botRequestService= jasmine.createSpyObj('BotRequestService',['createRq']);
   // TestBed.overrideProvider(BotRequestService, {useValue: botRequestService});
//    botRequestService = TestBed.get(BotRequestService);
//    spyOn(botRequestService, 'createRq');
    
//    fixture = TestBed.createComponent(CreateRiderComponent);
//    app = fixture.componentInstance;
    
//    app.ngOnInit();
    
//    app.botrequest.id=1;
//    app.botrequest.author=1;
    
//    app.save();
    
//    expect(botRequestService.createRq).toHaveBeenCalledTimes(1);
//  });
  
  it(`save should call monitoring service`, () => {
    monitoringService = TestBed.get(MonitoringService);
    botRequestService = TestBed.get(BotRequestService);
    app.ngOnInit();
    
    app.botrequest.id=1;
    app.botrequest.author=1;
    
    app.save();
    
    expect(monitoringService.start).toHaveBeenCalledTimes(1);
  });

});
