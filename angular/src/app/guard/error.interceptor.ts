import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, map  } from 'rxjs/operators';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { Router } from '@angular/router';


import {AuthenticationService } from '@ser/authentication.service';
import {AlertService } from '@ser/alert.service';
import {MonitoringService } from '@ser/monitoring.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshCycle = 0;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private firstCall=true;
    private interval;

    constructor(private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private monitoringService: MonitoringService,
                private router: Router,
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                if (this.refreshCycle < 2){
                    if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        
                        this.interval=IntervalObservable.create(5000) //10 s to refresh
                        .subscribe( data => {
                            if (this.firstCall){
                                this.firstCall=false;                            
                            }else{
                                this.refreshCycle=this.refreshCycle+1;
                                this.isRefreshing=false; 
                            }
                        })
                        
                        this.refreshTokenSubject.next(null);
                        
                        return this.authenticationService.refreshToken().pipe(
                        switchMap((token: any) => {
                            this.isRefreshing = false;
                            this.interval.unsubscribe();
                            this.firstCall=true;
                            this.refreshCycle=0;
                            console.log("refreshing token");
                            this.refreshTokenSubject.next(token.access);
                            return next.handle(this.addToken(request, token.access));
                        }
                        ));
                    } else {
                      return this.refreshTokenSubject.pipe(
                          filter(token => token != null),
                          take(1),
                          switchMap(access => {
                              console.log("token refreshed");
                              return next.handle(this.addToken(request, access));
                          })
                      );
                    } 
                    } else{
                        //this.monitoringService.reset(); //has to be here to avoid interdependency
                        this.alertService.error("long time without activity lead to log out");
                        this.authenticationService.logout();
                        this.router.navigate(['/login']);
                   }
    
            }
            else if (err.status===400){ //for register
                return throwError(err.error || err.error.message || err.statusText);
            }
            else if  (err.status===403){
                this.alertService.error("maximum number of requests per hour reached, wait a bit or contact the webmaster for extended rights");
            }            
            else if(err.status===404){
             console.log("error 404");
            }else
            {
            //if err.status === 403 --> alert Rate limit
                const error = err.error.message || err.statusText;
                return throwError(error);
            }
        }))
    }
    
    private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
    }
}
