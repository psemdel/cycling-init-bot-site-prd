import {JwtInterceptor} from './jwt.interceptor';
import {BotRequestService} from '@ser/bot-request.service';
import {AuthenticationService} from '@ser/authentication.service';
import { TestBed, fakeAsync, flush, async, ComponentFixture, tick } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { BotRequest} from '@app/models/models';
import { environment } from '@env/environment';
import { Injectable } from "@angular/core";

const authToken="accesstoken";

@Injectable()
class MockAuthenticationService {
    getJwtToken() {
    return authToken;
    }
}

describe('Jwt interceptor', () => {
    let botservice: BotRequestService;
    let baseUrl = environment.apiUrl +'bot_requests';
    let httpMock: HttpTestingController;
    let botrequest= new BotRequest();
    
    beforeEach(() => {         
        TestBed.configureTestingModule({ 
        providers: [ 
            BotRequestService, //use to trigger only
            {provide: AuthenticationService, useClass: MockAuthenticationService},
            {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
        ],
        imports: [HttpClientTestingModule]
        });
        
        botservice = TestBed.get(BotRequestService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('test jwt interception', fakeAsync(() => {
    
        const resp={'status':'ok'};
        const routine="create_rider";
        
     
        botservice.createRq(routine, botrequest).subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })
     
        const req=httpMock.expectOne(`${baseUrl}/create/${routine}/`);
        req.flush(resp);
        expect(req.request.headers.has('Authorization')).toEqual(true);
        expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${authToken}`);
    }));
    
    

});