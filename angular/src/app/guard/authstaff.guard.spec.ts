import {AuthGuardStaff} from './authstaff.guard';

import {AuthenticationService} from '@ser/authentication.service';

import { TestBed, fakeAsync, flush, async, ComponentFixture, tick } from '@angular/core/testing';
import { Injectable } from "@angular/core";

import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let guard: AuthGuardStaff;
let routeMock: any = { snapshot: {}};
let routeStateMock: any = { snapshot: {}, url: '/cookies'};
let routerMock = {navigate: jasmine.createSpy('navigate')};

describe('Auth guard staff', () => {
     it('Auth guard staff for admin users', () => {
     
        @Injectable()
        class MockAuthenticationService {
            isAdmin() {
            return true;
            }
        }

        TestBed.configureTestingModule({ 
        providers: [ 
            AuthGuardStaff,
            { provide: Router, useValue: routerMock },
            {provide: AuthenticationService, useClass: MockAuthenticationService},
        ],
        imports: [HttpClientTestingModule]
        });
        
        guard = TestBed.get(AuthGuardStaff);
        expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
     });
     
     
     it('Auth guard staff for not admin users', () => {
     
        @Injectable()
        class MockAuthenticationService {
            isAdmin() {
            return false;
            }
        }
  
        TestBed.configureTestingModule({ 
        providers: [ 
            AuthGuardStaff,
            { provide: Router, useValue: routerMock },
            {provide: AuthenticationService, useClass: MockAuthenticationService},
        ],
        imports: [HttpClientTestingModule]
        });
        
        guard = TestBed.get(AuthGuardStaff);

        expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
        expect(routerMock.navigate).toHaveBeenCalledTimes(1); 
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/cookies' } });
     }); 

});