import {AuthGuard} from './auth.guard';

import {AuthenticationService} from '@ser/authentication.service';

import { TestBed, fakeAsync, flush, async, ComponentFixture, tick } from '@angular/core/testing';
import { Injectable } from "@angular/core";

import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let guard: AuthGuard;
let routeMock: any = { snapshot: {}};
let routeStateMock: any = { snapshot: {}, url: '/cookies'};
let routerMock = {navigate: jasmine.createSpy('navigate')};

describe('Auth guard', () => {
     it('Auth guard for logged in users', () => {
     
        @Injectable()
        class MockAuthenticationService {
            isLoggedIn() {
            return true;
            }
        }

        TestBed.configureTestingModule({ 
        providers: [ 
            AuthGuard,
            { provide: Router, useValue: routerMock },
            {provide: AuthenticationService, useClass: MockAuthenticationService},
        ],
        imports: [HttpClientTestingModule]
        });
        
        guard = TestBed.get(AuthGuard);
        expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
     });
     
     
     it('Auth guard for not logged in users', () => {
     
        @Injectable()
        class MockAuthenticationService {
            isLoggedIn() {
            return false;
            }
        }
  
        TestBed.configureTestingModule({ 
        providers: [ 
            AuthGuard,
            { provide: Router, useValue: routerMock },
            {provide: AuthenticationService, useClass: MockAuthenticationService},
        ],
        imports: [HttpClientTestingModule]
        });
        
        guard = TestBed.get(AuthGuard);

        expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
        expect(routerMock.navigate).toHaveBeenCalledTimes(1); 
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/cookies' } });
     }); 

});