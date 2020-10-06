import {UserService} from '@ser/user.service';

import { TestBed, fakeAsync, flush } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { User, SetPass} from '@app/models/models';

describe('User service', () => {
    let service: UserService;
    let httpMock: HttpTestingController;
    let baseUrl = environment.apiUrl +'users';
    let authUrl = environment.authUrl;
        
    beforeEach(() => {
        TestBed.configureTestingModule({ 
        providers: [UserService],
        imports: [HttpClientTestingModule]
        });
        
        service = TestBed.get(UserService);
        httpMock = TestBed.get(HttpTestingController);
      });
      
     it('test get all', () => {
         const resp= [{"username":"user1","id":1},
                    {"username":"user2","id":1},
                    {"username":"user3","id":1},
         ];
         
         service.getAll().subscribe(
            rqs => {
                rqs.forEach( rq => {
                    expect(rq.id).toEqual(1)
                })  
        })

        const req=httpMock.expectOne(`${baseUrl}`);
        expect(req.request.method).toBe("GET");
        req.flush(resp);
     });
     
     it('test register', () => {
         const resp={'status':'ok'};
         
         let currentUser= new User();
         currentUser["username"]="tester";
         currentUser["password"]="very_secret_pass";
         currentUser["first_name"]="Jean";
         currentUser["last_name"]="Dupond";
         currentUser["email"]="tester@gmail.com";
         currentUser["password"]
    
         service.register(currentUser).subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })

        const req=httpMock.expectOne(`${authUrl}users/`);
        expect(req.request.method).toBe("POST");
        req.flush(resp);
     });
      
     it('test delete', () => {
         const resp={'status':'ok'};

         service.delete().subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })

        const req=httpMock.expectOne(`${authUrl}users/me/`);
        expect(req.request.method).toBe("DELETE");
        req.flush(resp);
     });  
     
     it('test forgotten password', () => {
         const resp={'status':'ok'};

         service.forgotten("tester@gmail.com").subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })

        const req=httpMock.expectOne(`${authUrl}users/reset_password/`);
        expect(req.request.method).toBe("POST");
        req.flush(resp);
     });      
         
     it('test resend email', () => {
         const resp={'status':'ok'};

         service.resendEmail("tester@gmail.com").subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })

        const req=httpMock.expectOne(`${authUrl}users/resend_activation/`);
        expect(req.request.method).toBe("POST");
        req.flush(resp);
     });   
     
     it('test change password', () => {
         const resp={'status':'ok'};
         
         const pass={
             'new_password':"old_secret_password",
             're_new_password':"new_secret_password",
             'current_password':"new_secret_password"
         }

         service.changePass(pass).subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })

        const req=httpMock.expectOne(`${authUrl}users/set_password/`);
        expect(req.request.method).toBe("POST");
        req.flush(resp);
     });             
         
      
     
      
});