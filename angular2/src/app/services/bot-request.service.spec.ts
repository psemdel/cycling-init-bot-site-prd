import { TestBed, inject, fakeAsync, flush } from '@angular/core/testing';
import {BotRequestService} from '@ser/bot-request.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { BotRequest} from '@app/models/models';

describe('Bot request service', () => {
    let service: BotRequestService;
    let httpMock: HttpTestingController;
    let baseUrl = environment.apiUrl +'bot_requests';
    let routine: string;
    let botrequest= new BotRequest();
    
    
    beforeEach(() => {
        TestBed.configureTestingModule({ 
        providers: [BotRequestService],
        imports: [HttpClientTestingModule]
        });
        
        service = TestBed.get(BotRequestService);
        httpMock = TestBed.get(HttpTestingController);
      });
      
      
     it('create rq', () => {
        const resp={'status':'ok'};
        routine="create_rider";
     
        service.createRq(routine, botrequest).subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })
     
        const req=httpMock.expectOne(`${baseUrl}/create/${routine}/`);
        expect(req.request.method).toBe("POST");
        req.flush(resp);
     });
     
     it('delete rq', () => {
        const resp={'status':'ok'};
        routine="create_rider";
        const rq_id=1;
        
        service.deleteRq(routine, rq_id).subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })
     
        const req=httpMock.expectOne(`${baseUrl}/delete/${routine}/${rq_id}`);
        expect(req.request.method).toBe("DELETE");
        req.flush(resp);
     });     
     
     it('run rq', () => {
        const resp={'status':'ok'};
        
        service.runRq(botrequest).subscribe(
            ans => {expect(resp['status']).toEqual('ok');
        })
     
        const req=httpMock.expectOne(`${baseUrl}/run/`);
        expect(req.request.method).toBe("POST");
        req.flush(resp);
     });  
  
     it('get all rq', () => {
        botrequest.id=10;
        const resp=[botrequest,botrequest];
        routine="create_rider";
        const author_id=1;
        
        service.getAllRq(routine, author_id).subscribe(
          rqs => {
               rqs.forEach( rq => {
                expect(rq.id).toEqual(10)
             })  
        })
     
        const req=httpMock.expectOne(`${baseUrl}/all/${routine}/${author_id}`);
        expect(req.request.method).toBe("GET");
        req.flush(resp);
     });  
  
     it('get rq', () => {
        botrequest.id=10;
        const resp=[botrequest,botrequest];
        routine="create_rider";
        const author_id=1;
        
        service.getRq(routine, author_id).subscribe(
          rqs => {
               rqs.forEach( rq => {
                expect(rq.id).toEqual(10)
             })  
        })
     
        const req=httpMock.expectOne(`${baseUrl}/get/${routine}/${author_id}`);
        expect(req.request.method).toBe("GET");
        req.flush(resp);
     });    
 
      
      
    });