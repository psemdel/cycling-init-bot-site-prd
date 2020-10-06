import { TestBed, inject, fakeAsync, flush, async } from '@angular/core/testing';
import {AuthenticationService} from '@ser/authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';

describe('Authentication service', () => {
    let service: AuthenticationService;
    let data: string;
    let httpMock: HttpTestingController;
    let authUrl = environment.authUrl;
    let temp: any;
    
    beforeEach(() => {
        TestBed.configureTestingModule({ 
        providers: [AuthenticationService],
        imports: [HttpClientTestingModule]
        });
        
        service = TestBed.get(AuthenticationService);
        httpMock = TestBed.get(HttpTestingController);
      });
    
    it('get JWT',  () =>{
        localStorage.setItem("JWT_TOKEN", "abc");
        data=service.getJwtToken();
        expect(data).toEqual("abc");
    });
    
  //  if('get refresh token', () =>{
  //      localStorage.setItem("REFRESH_TOKEN", "def");
  //      data=service.getRefreshToken();
  //      expect(data).toEqual("def");
  //  });
    
    it('isLogged',  () =>{
        localStorage.setItem("JWT_TOKEN", "abc");
        expect(service.isLoggedIn()).toBeTrue();
    });   
    
     it('login',  () =>{
        const resp={"username":"admin","id":"1","level":true, "access":"abc","refresh":"def"}; 
        service.login("tester","password").subscribe(
          user=> {
              temp=JSON.parse(localStorage.getItem('currentUser'));
              expect(temp["username"]).toEqual("admin");
              expect(temp["id"]).toEqual("1");
              expect(temp["level"]).toEqual(true);
              }      
        );
        
        const req=httpMock.expectOne(`${authUrl}jwt/create/`);
        expect(req.request.method).toBe("POST");
        req.flush(resp);
 
    });      

    it('isAdmin should be true',  () =>{
        const resp={"username":"admin","id":"1","level":true, "access":"abc","refresh":"def"}; 
        service.login("tester","password").subscribe(
          user=> {
                expect(service.isAdmin()).toBeTrue();
          }      
        );
        
        const req=httpMock.expectOne(`${authUrl}jwt/create/`);
        req.flush(resp);
    });
    
     it('isAdmin should be false',  () =>{
        const resp={"username":"admin","id":"1","level":false, "access":"abc","refresh":"def"}; 
        service.login("tester","password").subscribe(
          user=> {
                expect(service.isAdmin()).toBeFalse();
          }      
        );
        
        const req=httpMock.expectOne(`${authUrl}jwt/create/`);
        req.flush(resp);
    });  
    
    it('loggout', () =>{
        const resp={"username":"admin","id":"1","level":false, "access":"abc","refresh":"def"}; 
        service.login("tester","password").subscribe(
          user=> {
                expect(service.isLoggedIn()).toBeTrue();
                service.logout()
                expect(service.isLoggedIn()).toBeFalse();
                
          })      
        
        const req=httpMock.expectOne(`${authUrl}jwt/create/`);
        req.flush(resp);
    });
    
    it('refresh token', () =>{
        const resp={"access":"abc"};
        localStorage.setItem("REFRESH_TOKEN", "def");
        
        service.refreshToken().subscribe(
        ans => { 
               data=service.getJwtToken();
               expect(data).toEqual("abc");
        })
        
        const req=httpMock.expectOne(`${authUrl}jwt/refresh/`);
        expect(req.request.method).toBe("POST");
        req.flush(resp);       
    });
    
    });    

         
