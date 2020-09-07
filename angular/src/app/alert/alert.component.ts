import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { AlertService } from '@ser/alert.service';
import { Message } from '@app/models/lists';

@Component({ 
selector: 'alert', 
templateUrl: 'alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: Message ;
    success: boolean;

    constructor(private alertService: AlertService,
                private router: Router
    ) { 
    
      this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
               this.ngOnInit(); //reload subject
            }
        });
    }
    ngOnInit() {
        this.subscription = this.alertService.getAlert()
            .subscribe(message => {
               if (message){
                this.message = message;
                    if (message.type=='success'){
                       this.success=true;
                    }else{
                       this.success=false;
                    }
                //window.alert(message);
               }else{
                 this.message=null;
                 //this.success=true;
               }
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}