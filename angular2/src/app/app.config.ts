import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient} from  '@angular/common/http';

import { routes } from './app.routes';

import { APP_BASE_HREF } from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {JwtInterceptor} from './guard/jwt.interceptor';
import {ErrorInterceptor} from './guard/error.interceptor';
import {LoadingInterceptorService } from './guard/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    {provide: APP_BASE_HREF, useValue: '/'},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {  appearance: 'fill'} },
   // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true },
  ]
};
