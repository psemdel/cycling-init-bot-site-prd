import { TestBed, inject, fakeAsync, flush, async, tick } from '@angular/core/testing';
import {AlertService} from '@ser/alert.service';
import { Observable, Subject } from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {routes} from '@app/routing.module';

describe('Alert service', () => {
    let service: AlertService;
    let obs: Observable<any>;
    let router: Router;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes(routes)], 
        providers: [AlertService]
        });
        router = TestBed.get(Router);
        service = new AlertService(router);
        
      });
    
    it('test success',  (done) =>{
        obs=service.getAlert();
        obs.subscribe(
        data=> {
            expect(data).toEqual({ type: 'success', text: 'work' });
            done();
        })
        service.success('work');
    });
    
    it('test error',  (done) =>{
        obs=service.getAlert();
        obs.subscribe(
        data=> {
            expect(data).toEqual({ type: 'error', text: 'work' });
            done();
        })
        service.error('work');
    });
    
    it('test clear',  (done) =>{
        obs=service.getAlert();
        obs.subscribe(
        data=> {
            expect(data).toEqual(undefined);
            done();
        })
        service.clear();
    });
    
   // it('test clear 2',  fakeAsync(() =>{
   //     obs=service.getAlert();
   //     service.success('work');
  //      setTimeout(() => { service.clear(); }, 100);
   //     obs.subscribe(
   //     data=> {
    //        expect(data).toEqual({ type: 'success', text: 'work' });
   //     })
    //    tick(200);
    //    obs.subscribe(
    //    data=> {
   //         expect(data).toEqual(undefined);
    //    })
        
   //     })
   
   // );   
    
    });
         
