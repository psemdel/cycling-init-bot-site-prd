import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User} from '@app/models/models';
import { of  } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class MockAuthenticationService {
  currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>; //save other information about user

  constructor() {
        this.currentUserSubject = new BehaviorSubject<User>({"id":1,"username":"tester","password":"","email":"",
    "first_name":"","last_name":"","wiki_name":"","level":false}); 
        this.currentUser = this.currentUserSubject.asObservable();
    }
    
   login(username, password) {
        return of("ras");
   } 
}