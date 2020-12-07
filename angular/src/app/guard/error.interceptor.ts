import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, map  } from 'rxjs/operators';
import { Router } from '@angular/router';


import {AuthenticationService } from '@ser/authentication.service';
import {AlertService } from '@ser/alert.service';
import {MonitoringService } from '@ser/monitoring.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


    constructor(private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private monitoringService: MonitoringService,
                private router: Router,
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                //this.authenticationService.logout();
                //location.reload(true);
                
                if (err.url.indexOf("jwt/refresh") !=-1){ //detect refresh token rejected
                    this.isRefreshing = false;
                    this.authenticationService.logout();
                    this.router.navigate(['/login']);
                    return throwError(err.error || err.error.message || err.statusText);
                } else {   
                    
                    if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        this.refreshTokenSubject.next(null);
                        
                        return this.authenticationService.refreshToken().pipe(
                        switchMap((token: any) => {
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(token.access);
                        return next.handle(this.addToken(request, token.access));
                        }
                        ));
                    } else {
                        return this.refreshTokenSubject.pipe(
                            filter(token => token != null),
                            take(1),
                            switchMap(access => {
                            return next.handle(this.addToken(request, access));
                        }));
                    }
            }
            }
            else if (err.status===400){ //for register
               // this.authenticationService.logout(); //invalid refresh token send 400
                return throwError(err.error || err.error.message || err.statusText);
            }
            else if  (err.status===403){
                this.alertService.error("maximum number of requests per hour reached, wait a bit or contact the webmaster for extended rights");
                return throwError(err.error || err.error.message || err.statusText);
            }            
            else if(err.status===404){
                console.log("error 404");
                return throwError(err.error || err.error.message || err.statusText);
            }else
            {
            //if err.status === 403 --> alert Rate limit
                const error = err.error.message || err.statusText;
                return throwError(err.error || err.error.message || err.statusText);
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
