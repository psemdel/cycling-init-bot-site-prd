import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, map  } from 'rxjs/operators';

import {AuthenticationService } from '@ser/authentication.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
               
                if (!this.isRefreshing) {
                    this.isRefreshing = true;
                    this.refreshTokenSubject.next(null);
                    
                    return this.authenticationService.refreshToken().pipe(
                    switchMap((token: any) => {
                        this.isRefreshing = false;
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
