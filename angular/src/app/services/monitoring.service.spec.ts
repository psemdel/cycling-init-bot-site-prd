import {MonitoringService} from '@ser/monitoring.service';

import {MockAuthenticationService} from '../mock/mock-authentication.service';

import { TestBed, fakeAsync, flush, async, ComponentFixture, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { User, BotRequest} from '../models/models';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { HttpResponse} from '@angular/common/http';

import { BotRequestService} from '../services/bot-request.service';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService} from '../services/alert.service';
import { EventEmitter, Injectable, Output } from "@angular/core";

const rq_list= [{"status":"started","id":1},
                {"status":"failed","id":2},
                {"status":"started","id":3},
];

@Injectable()
class MockBotRequestService {
     createRq(routine: string, botrequest: BotRequest){
       return of("ras");
     }
     
     getRq(routine: string, author_id: number){
       return of(rq_list);
     }
}

describe('Monitoring service', () => {
    let service: MonitoringService;
    let obs: Observable<any>;
    let botRequestService: MockBotRequestService ;
    
    beforeEach(async(() => {
        const authenticationService=new MockAuthenticationService();
        const alertService= jasmine.createSpyObj('AlertService',['clear','event_completed','event_failed']);
        
        TestBed.configureTestingModule({ 
        providers: [MonitoringService,
             { provide: AuthenticationService, useValue: authenticationService},
             { provide: AlertService, useValue: alertService },
             { provide: BotRequestService, useClass: MockBotRequestService  },
        ]
        });
        
        service = TestBed.get(MonitoringService);
      }));

      it('start checking', (done) => {
           obs=service.checking$.asObservable();
           obs.subscribe(
            data=> {
            expect(data).toEqual(true);
            done();
           })
        service.startChecking()
      });

      it('stop checking', (done) => {
           obs=service.checking$.asObservable();
           obs.subscribe(
            data=> {
            expect(data).toEqual(false);
            done();
           })
        service.stopChecking()
      });
      
      //get status
      it('check status', fakeAsync(() => {
        service.get_status("team");
        flush();
        expect(service.running_rq).toEqual([1,3]);
        expect(service.running_routine).toEqual(["team","team"]);
      }));
      
      it('start routine', fakeAsync(() => {
          service.reset();
          spyOn(service, 'get_status');
          spyOn(service, 'startChecking');
          flush();
          service.start("team");
          flush();
          service.checking$.asObservable().subscribe(
            data=> {
            expect(data).toEqual(true);
          })
          
          expect(service.get_status).toHaveBeenCalledTimes(1);
          expect(service.startChecking).toHaveBeenCalledTimes(1);
          expect(service.nb_started_routines).toEqual(1);
          expect(localStorage.getItem('NB_STARTED_ROUTINES')).toEqual('1');
      }));
      
      it('reset counter', fakeAsync(() => {
          service.start("team");
          flush();    
          service.reset();  
          flush();
          
          expect(service.nb_started_routines).toEqual(0);
          expect(localStorage.getItem('NB_STARTED_ROUTINES')).toEqual('0');
      
      }));
      
      
})