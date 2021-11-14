import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
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
        service = TestBed.get(AlertService)
        
      });
    
    it('test success',  (done) =>{
        obs=service.getAlert();
        obs.subscribe(
        data=> {
            expect(data.type).toEqual('success');
            expect(data.text).toEqual('work');
            done();
        });
        service.success('work');
    });

    it('test success fake',  fakeAsync(() =>{
        obs=service.getAlert();
        service.success('work');
        flush();
        obs.subscribe(
        data=> {
            expect(data.type).toEqual('success');
            expect(data.text).toEqual('work');
        });
        flush();
    }));
    
    it('test error',  (done) =>{
        obs=service.getAlert();
        obs.subscribe(
        data=> {
            expect(data.type).toEqual('error');
            expect(data.text).toEqual('work');
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
    
    it('test clear 2',  fakeAsync(() =>{
        obs=service.getAlert();
        service.success('work');
        flush();        

      //  obs.subscribe(
      //  data=> {
      //      expect(data.type).toEqual('success');
       //     expect(data.text).toEqual('work');
    //    })

        tick(100);
        service.clear();
        flush();
        obs.subscribe(
        data=> {
            expect(data).toEqual(undefined);
        });
        flush();
       })
    );   
    
    });
         
