import {LoadingInterceptorService} from './loading.interceptor';
import {LoadingService} from '@ser/loading.service';
import {BotRequestService} from '@ser/bot-request.service';
import { TestBed, fakeAsync, flush, async, ComponentFixture, tick } from '@angular/core/testing';
import { BotRequest} from '@app/models/models';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { environment } from '@env/environment';

describe('Loading interceptor', () => {
    let service: LoadingService;
    let loadingService: LoadingService;
    let botservice: BotRequestService;
    let interceptor: LoadingInterceptorService;
    let baseUrl = environment.apiUrl +'bot_requests';
    let httpMock: HttpTestingController;
    let botrequest= new BotRequest();
            
    loadingService= jasmine.createSpyObj('LoadingService',['startLoading','stopLoading']);
    
    beforeEach(() => {         
        TestBed.configureTestingModule({ 
        providers: [ 
            BotRequestService, //use to trigger only
            LoadingInterceptorService,
            {provide: LoadingService, useValue: loadingService},
            {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true }
        ],
        imports: [HttpClientTestingModule]
        });
        
        service = TestBed.get(LoadingService);
        botservice = TestBed.get(BotRequestService);
        interceptor = TestBed.get(LoadingInterceptorService);
        httpMock = TestBed.get(HttpTestingController);
    });
    //http request
    
    it('test loading interception', fakeAsync(() => {
    
        const resp={'status':'ok'};
        const routine="create_rider";
     
        botservice.createRq(routine, botrequest).subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })
     
        const req=httpMock.expectOne(`${baseUrl}/create/${routine}/`);
        req.flush(resp);
    
        expect(service.startLoading).toHaveBeenCalledTimes(1);   
        expect(service.stopLoading).toHaveBeenCalledTimes(1);   
        //expect(interceptor.activeRequests).toEqual(1);
        flush();
   
    }));
    
});