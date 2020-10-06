import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Message } from '@app/models/lists';

@Injectable({ providedIn: 'root' })

export class AlertService {
    private subject = new Subject<Message>();
    private keepAfterRouteChange = false;
    //msg: Message;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert message
                    this.clear();
                }
            }
        });
    }

    getAlert() {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
       // this.msg.text=message;
       // this.msg.type='success';
       // this.subject.next(this.msg);
       this.subject.next({type:'success',text:message});
    }

    error(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
       // this.msg.text=message;
       // this.msg.type='error';
      // this.subject.next(this.msg); 
      this.subject.next({type:'error',text:message});  
    }

    clear() {
        // clear by calling subject.next() without parameters
        this.subject.next();
    }
}