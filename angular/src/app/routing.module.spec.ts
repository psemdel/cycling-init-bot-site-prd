//import { routes} from './routing.module';

import { Location } from "@angular/common";
import { TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Router, Routes } from "@angular/router";

import {AuthGuard} from './guard/auth.guard';
import {AuthGuardStaff} from './guard/authstaff.guard';

import { Component, Injectable } from "@angular/core";

@Component({ template: '<router-outlet></router-outlet>' })
class TestBootstrapComponent {}

@Component({ template: '' })
class TestComponent {}

@Injectable()
class MockAuthGuard {
    canActivate() {
    return true;
    }
}

@Injectable()
class MockAuthGuard_false {
    canActivate() {
    return false;
    }
}
  //  router.navigate(['/login']);

@Injectable()
class MockAuthGuardStaff {
    canActivate() {
    return true;
    }
}

@Injectable()
class MockAuthGuardStaff_false  {
    canActivate() {
    return false;
    }
}
//    router.navigate(['/login']);

describe('router testing', () => {
  let location: Location;
  let router: Router;
  let fixture;
  let mockAuthGuard: AuthGuard;
  let mockAuthGuardStaff: AuthGuardStaff;  
  
    const init_staff = (() => {
        //we test route similar to the true one
    
        const routesUnderTest: Routes = [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: TestComponent},
            { path: 'race', component: TestComponent, canActivate: [AuthGuard] },
            { path: 'national-all-champs', component: TestComponent, canActivate: [AuthGuardStaff] },
        ];
    
        TestBed
        .configureTestingModule({
          imports: [RouterTestingModule.withRoutes(routesUnderTest), 
                   ],   //HttpClientTestingModule
          providers: [ 
              {provide: AuthGuard, useClass: MockAuthGuard},
              {provide: AuthGuardStaff, useClass: MockAuthGuardStaff}
               ],
          declarations: [ TestComponent, TestBootstrapComponent ]
        });
        
        router = TestBed.get(Router);
        location = TestBed.get(Location);
    
        fixture = TestBed.createComponent(TestBootstrapComponent);
        router.initialNavigation();
    });
    
    const init_normal = (() => {
        //we test route similar to the true one
    
        const routesUnderTest: Routes = [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: TestComponent},
            { path: 'race', component: TestComponent, canActivate: [AuthGuard] },
            { path: 'national-all-champs', component: TestComponent, canActivate: [AuthGuardStaff] },
        ];
    
        TestBed
        .configureTestingModule({
          imports: [RouterTestingModule.withRoutes(routesUnderTest), 
                   ],   //HttpClientTestingModule
          providers: [ 
              {provide: AuthGuard, useClass: MockAuthGuard},
              {provide: AuthGuardStaff, useClass: MockAuthGuardStaff_false}
               ],
          declarations: [ TestComponent, TestBootstrapComponent ]
        });
        
        router = TestBed.get(Router);
        location = TestBed.get(Location);
    
        fixture = TestBed.createComponent(TestBootstrapComponent);
        router.initialNavigation();
    });
    
     const init_nolog = (() => {
        //we test route similar to the true one
    
        const routesUnderTest: Routes = [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: TestComponent},
            { path: 'race', component: TestComponent, canActivate: [AuthGuard] },
            { path: 'national-all-champs', component: TestComponent, canActivate: [AuthGuardStaff] },
        ];
    
        TestBed
        .configureTestingModule({
          imports: [RouterTestingModule.withRoutes(routesUnderTest), 
                   ],   //HttpClientTestingModule
          providers: [ 
              {provide: AuthGuard, useClass: MockAuthGuard_false},
              {provide: AuthGuardStaff, useClass: MockAuthGuardStaff_false}
               ],
          declarations: [ TestComponent, TestBootstrapComponent ]
        });
        
        router = TestBed.get(Router);
        location = TestBed.get(Location);
    
        fixture = TestBed.createComponent(TestBootstrapComponent);
        router.initialNavigation();
    });  

      it('navigate to "" redirects you to /home', fakeAsync(() => {
        init_staff();
        router.navigate([""]).then(() => {
          expect(location.path()).toBe("/home");
        });
        flush();
      }));
      
      it('navigate to "home" takes you to /home', fakeAsync(() => {
        init_staff();
        router.navigate(["/home"]).then(() => {
          expect(location.path()).toBe("/home");
        });
        flush();
   }));

   it('navigate to "race" takes you to /race', fakeAsync(() => {
        init_staff();
        router.navigate(["/race"]).then(() => {
          expect(location.path()).toBe("/race");
        });
        flush();
   }));
   
   it('navigate to "national-all-champs" takes you to /national-all-champs', fakeAsync(() => {
        init_staff();
        router.navigate(["/national-all-champs"]).then(() => {
          expect(location.path()).toBe("/national-all-champs");
        });
        flush();
   }));

   it('navigate to "home" takes you to /home', fakeAsync(() => {
        init_normal();
        router.navigate(["/home"]).then(() => {
          expect(location.path()).toBe("/home");
        });
        flush();
   }));

   it('navigate to "race" takes you to /race', fakeAsync(() => {
        init_normal();
        router.navigate(["/race"]).then(() => {
          expect(location.path()).toBe("/race");
        });
        flush();
   }));
   
   it('navigate to "national-all-champs" takes you to /national-all-champs', fakeAsync(() => {
        init_normal();
        router.navigate(["/national-all-champs"]).then(() => {
          expect(location.path()).toBe("/");
        });
        flush();
   }));
   
   it('navigate to "home" takes you to /home', fakeAsync(() => {
        init_nolog();
        router.navigate(["/home"]).then(() => {
          expect(location.path()).toBe("/home");
        });
        flush();
   }));

   it('navigate to "race" takes you to /race', fakeAsync(() => {
        init_nolog();
        router.navigate(["/race"]).then(() => {
          expect(location.path()).toBe("/");
        });
        flush();
   }));
   
   it('navigate to "national-all-champs" takes you to /national-all-champs', fakeAsync(() => {
        init_nolog();
        router.navigate(["/national-all-champs"]).then(() => {
          expect(location.path()).toBe("/");
        });
        flush();
   }));
   
     
});