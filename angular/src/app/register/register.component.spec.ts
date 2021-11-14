import { RegisterComponent } from './register.component';

import { UserService } from '@ser/user.service';
import {User} from '../models/models';

import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@ser/authentication.service';
import {MockAuthenticationService} from '../mock/mock-authentication.service';

import { Injectable } from "@angular/core";
import { Location } from "@angular/common";

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import {BehaviorSubject, Observable, of } from 'rxjs';

@Injectable()
class MockUserService {
    register(user: User) {
        return of("ras");
    }
}

export class MockAuthenticationService_nouser {
  currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>; //save other information about user

  constructor() {
        this.currentUserSubject = new BehaviorSubject<User>(null); 
        this.currentUser = this.currentUserSubject.asObservable();
    }
}

describe('test register component', () => {
    let fixture: ComponentFixture<RegisterComponent>;
    let component: RegisterComponent;
    let userService: UserService;
    let location: Location;
 
    const init_no_user = (() => {         
            TestBed.configureTestingModule({ 
            declarations: [ RegisterComponent],
            providers: [ 
                FormBuilder,
                {provide: UserService, useClass: MockUserService},
                {provide: AuthenticationService, useClass: MockAuthenticationService_nouser},
            ],
             imports: [RouterTestingModule]
            });

            fixture = TestBed.createComponent(RegisterComponent);
            component = fixture.componentInstance;
            
            userService=TestBed.get(UserService);
     });

    const init_with_user = (() => {         
            TestBed.configureTestingModule({ 
            declarations: [ RegisterComponent],
            providers: [ 
                FormBuilder,
                {provide: UserService, useClass: MockUserService},
                {provide: AuthenticationService, useClass: MockAuthenticationService},
            ],
             imports: [RouterTestingModule]
            });

            fixture = TestBed.createComponent(RegisterComponent);
            component = fixture.componentInstance;
            
            userService=TestBed.get(UserService);
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
        expect(component.registerForm.invalid).toEqual(true);
     }); 

      it('submit invalid form 1', () => {
        init_no_user();
        component.ngOnInit();
        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.success).toEqual(false);
        expect(component.loading).toEqual(false); 
     });    
     
      it('submit invalid form, email', () => {
        init_no_user();
        component.ngOnInit();
        
        component.f.first_name.setValue("first");
        component.f.last_name.setValue("last");
        component.f.username.setValue("user");
        component.f.email.setValue("abc");
        component.f.password.setValue("pass");
        component.f.confirmPass.setValue("pass");

        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.success).toEqual(false);
        expect(component.loading).toEqual(false); 
        expect(component.f.email.errors).toBeTruthy();
        expect(component.f.email.errors.email).toEqual(true);
     });         
     
     it('submit invalid form, pass', () => {
        init_no_user();
        component.ngOnInit();
        
        component.f.first_name.setValue("first");
        component.f.last_name.setValue("last");
        component.f.username.setValue("user");
        component.f.email.setValue("a@a.com");
        component.f.password.setValue("pass1");
        component.f.confirmPass.setValue("pass2");

        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.success).toEqual(false);
        expect(component.loading).toEqual(false); 
        expect(component.registerForm.errors.notSame).toEqual(true);
     });       
     
      it('submit invalid form, username empty', () => {
        init_no_user();
        component.ngOnInit();
        
        component.f.first_name.setValue("first");
        component.f.last_name.setValue("last");
        component.f.username.setValue("");
        component.f.email.setValue("a@a.com");
        component.f.password.setValue("pass");
        component.f.confirmPass.setValue("pass");

        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.success).toEqual(false);
        expect(component.loading).toEqual(false); 
        expect(component.f.username.errors).toBeTruthy();  
        expect(component.f.username.errors.required).toEqual(true);
     }); 
         
      it('submit valid form', () => {
        init_no_user();
        component.ngOnInit();
        spyOn(userService,'register').and.returnValue(of("ras"));
        
        component.f.first_name.setValue("first");
        component.f.last_name.setValue("last");
        component.f.username.setValue("user");
        component.f.email.setValue("a@a.com");
        component.f.password.setValue("pass");
        component.f.confirmPass.setValue("pass");
        
        component.onSubmit();
        expect(component.submitted).toEqual(true);
        expect(component.success).toEqual(true);
        expect(userService.register).toHaveBeenCalledTimes(1);
     });
     
     it('test checkPasswords ok', () => { 
        init_no_user();
        component.ngOnInit();
      
        component.f.password.setValue("pass");
        component.f.confirmPass.setValue("pass");
        
        expect(component.checkPasswords(component.registerForm)).toEqual(null);
     }); 
     
     it('test checkPasswords fail', () => { 
        init_no_user();
        component.ngOnInit();
      
        component.f.password.setValue("pass1");
        component.f.confirmPass.setValue("pass2");
        
        expect(component.checkPasswords(component.registerForm)).toEqual({ notSame: true });
     });  
     
     it('forward by user logged', () => {  
         init_with_user();
         component.ngOnInit();
         
         location = TestBed.get(Location);
         expect(location.path()).toBe("");
     }); 
     

});
