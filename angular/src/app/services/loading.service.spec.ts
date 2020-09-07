import { TestBed, inject, fakeAsync, flush, async } from '@angular/core/testing';
import {LoadingService} from '@ser/loading.service';

describe('Loading service', () => {
    let service: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [LoadingService]});
        service = new LoadingService();
      });
    
    it('start loading',  (done) =>{
        service.loading$.subscribe(
        data=> {
            expect(data).toBeTrue();
            done();
        })
        service.startLoading();
    });
    
    it('stop loading',  (done) =>{
        service.loading$.subscribe(
        data=> {
            expect(data).toBeFalse();
            done();
        })
        service.stopLoading();
    });  
    
    
    });
         
