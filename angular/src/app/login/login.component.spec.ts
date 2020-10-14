import { LoginComponent } from './login.component';

import { UserService } from '@ser/user.service';
import {User} from '../models/models';
import { Router, Routes, ActivatedRoute, Params } from '@angular/router';

import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@ser/authentication.service';
import { MockAuthenticationService} from '../mock/mock-authentication.service';

import { Component, Injectable } from "@angular/core";
import { Location } from "@angular/common";

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {BehaviorSubject, Observable, of, from } from 'rxjs';

export class MockAuthenticationService_nouser {
  currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>; //save other information about user

  constructor() {
        this.currentUserSubject = new BehaviorSubject<User>(null); 
        this.currentUser = this.currentUserSubject.asObservable();
    }
    
   login(username, password) {
        return of("ras");
   } 
}

@Component({ template: '' })
class TestComponent {}

    const routesUnderTest: Routes = [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: TestComponent},
        { path: 'race', component: TestComponent },
    ];

describe('test login component', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let authenticationService:  AuthenticationService;
    let location: Location;
    let router: Router;
    
    const init_no_user = (() => {         
            TestBed.configureTestingModule({ 
            imports: [RouterTestingModule.withRoutes(routesUnderTest)], 
            declarations: [ LoginComponent],
            providers: [ 
                FormBuilder,
                {
                provide: ActivatedRoute,
                useValue: {
                //    data: {
                  //      subscribe: (fn: (value: Data) => void) => fn({
                 //           company: COMPANY,
                 //       }),
                 //   },
                    params: {
                        subscribe: (fn: (value: Params) => void) => fn({
                            id: 1,
                        }),
                    },
                    snapshot: {
                        url: [
                            {
                                path: 'race',
                            },
                        ],
                        queryParams: [{
                                returnUrl: 'race',
                        }]
                    },
                },
                },
             //   ActivatedRoute, 
              //  {provide: ActivatedRoute,  
              //  useValue: {params: from([{id: 1}]),
             //   },
             //   },
                {provide: AuthenticationService, useClass: MockAuthenticationService_nouser},
            ]
            });

            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            
            authenticationService = TestBed.get(AuthenticationService);
            router = TestBed.get(Router);
            router.navigate(["race"]);
     });

    const init_with_user = (() => {         
            TestBed.configureTestingModule({ 
            imports: [RouterTestingModule.withRoutes(routesUnderTest)], 
            declarations: [ LoginComponent],
            providers: [ 
                FormBuilder,
                {
                provide: ActivatedRoute,
                useValue: {
                 //   data: {
                  //      subscribe: (fn: (value: Data) => void) => fn({
                  //          company: COMPANY,
                  //      }),
                 //   },
                    params: {
                        subscribe: (fn: (value: Params) => void) => fn({
                            id: 1,
                        }),
                    },
                    snapshot: {
                        url: [
                            {
                                path: 'race',
                            },
                        ],
                        queryParams: [{
                                returnUrl: 'race',
                        }]
                    },
                },
                },
                //ActivatedRoute, 
              // {provide: ActivatedRoute,  
             //  useValue: {params: from([{id: 1}]),
             //  },
             //  },
                {provide: AuthenticationService, useClass: MockAuthenticationService},
            ],
            });

            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            
            authenticationService = TestBed.get(AuthenticationService);
            router = TestBed.get(Router);
            router.navigate(["race"]);
     });
          
     it('should create', () => {
        init_no_user();
        expect(component).toBeDefined();
     });

     it('test f', () => {
       init_no_user();
       component.ngOnInit();
       expect(component.f.username.value).toEqual("");
     });    
     
     
     it('form invalid at init', () => {
        init_no_user();
        component.ngOnInit();
        expect(component.loginForm.invalid).toEqual(true);
     }); 

      it('submit invalid form 1', () => {
        init_no_user();
        component.ngOnInit();
        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.loggedfail).toEqual(false);
        expect(component.loading).toEqual(false); 
     });    
     
      it('submit invalid form, username empty', () => {
        init_no_user();
        component.ngOnInit();
        
        component.f.username.setValue("");
        component.f.password.setValue("pass");

        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.loggedfail).toEqual(false);
        expect(component.loading).toEqual(false); 
        expect(component.f.username.errors).toBeTruthy();  
        expect(component.f.username.errors.required).toEqual(true);
     }); 
         
      it('submit valid form', () => {
        init_no_user();
        component.ngOnInit();
        spyOn(authenticationService,'login').and.returnValue(of());//does not seem to be optimal
        
        component.f.username.setValue("test");
        component.f.password.setValue("pass");
        
        component.onSubmit();
        expect(component.submitted).toEqual(true);
       // expect(component.loggedfail).toEqual(false);
        expect(component.loading).toEqual(false);
        expect(authenticationService.login).toHaveBeenCalledTimes(1);
        
        location = TestBed.get(Location);
        expect(location.path()).toBe("");
     });

     
     it('forward by user logged', () => {  
         init_with_user();
         component.ngOnInit();
         
         location = TestBed.get(Location);
         expect(location.path()).toBe("");
     }); 
     

});
