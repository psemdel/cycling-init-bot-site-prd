import { CreateRiderComponent } from './create-rider.component';

import { BotRequestService } from '@ser/bot-request.service';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@ser/authentication.service';
import {MockAuthenticationService} from '../mock/mock-authentication.service';
import { BotRequest} from '../models/models';
import { Injectable } from "@angular/core";

import { AlertService } from '@ser/alert.service';
import { MonitoringService } from '@ser/monitoring.service';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

@Injectable()
class MockBotRequestService {
     createRq(routine: string, botrequest: BotRequest){
       return of("ras");
     }
}


describe('CreateRiderComponent', () => {
    let mockBotRequestService: BotRequestService;
    let mockMonitoringService:  MonitoringService;
    let mockAlertService: AlertService;
    let fixture: ComponentFixture<CreateRiderComponent>;
    let component: CreateRiderComponent;
    
   // mockBotRequestService= jasmine.createSpyObj('BotRequestService',['createRq']);
    mockMonitoringService= jasmine.createSpyObj(' MonitoringService',['start']);
    mockAlertService= jasmine.createSpyObj(' AlertService',['clear']);
    
    beforeEach(() => {         
            TestBed.configureTestingModule({ 
            declarations: [ CreateRiderComponent],
            providers: [ 
                FormBuilder,
                {provide: BotRequestService, useClass: MockBotRequestService},
                {provide: AlertService, useValue: mockAlertService},
                {provide: MonitoringService, useValue: mockMonitoringService},
                {provide: AuthenticationService, useClass: MockAuthenticationService},
            ],
            });

            fixture = TestBed.createComponent(CreateRiderComponent);
            component = fixture.componentInstance;
            
            mockAlertService=TestBed.get(AlertService);
            mockBotRequestService=TestBed.get(BotRequestService);
            mockMonitoringService=TestBed.get(MonitoringService);
     });


     it('should create', () => {
        expect(component).toBeDefined();
     });
     
     it('ngInit should clear', () => {
         component.ngOnInit();
         expect(mockAlertService.clear).toHaveBeenCalledTimes(1);
         expect(component.lastname).toEqual(""); 
     });   
     

     it('test f', () => {
       component.ngOnInit();
        expect(component.f.gender.value).toEqual("");
     });    
     
     it('form invalid at init', () => {
        component.ngOnInit();
        expect(component.registerForm.invalid).toEqual(true);
     }); 

      it('submit invalid form', () => {
        component.ngOnInit();
        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.lastname).toEqual(""); 
     });    
     
      it('submit valid form', () => {
        component.ngOnInit();
        spyOn(component,'save');
        
        component.registerForm.controls.name.setValue("tester");
        component.registerForm.controls.gender.setValue("woman");
        component.registerForm.controls.nationality.setValue("FRA");
        
        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.lastname).toEqual("tester"); 
        expect(component.save).toHaveBeenCalledTimes(1);
        expect(component.botrequest.author).toEqual(1);
     });      
     
     it('test save', () => {
        component.ngOnInit();
        spyOn(mockBotRequestService,'createRq').and.returnValue(of("ras"));
        
        component.botrequest= new BotRequest();
        
        component.save();
        expect(component.lastname).toEqual(""); 
        expect(mockBotRequestService.createRq).toHaveBeenCalledTimes(1);
        expect(mockMonitoringService.start).toHaveBeenCalledTimes(1);
    
     });
});
