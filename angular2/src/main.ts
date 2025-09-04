import { bootstrapApplication } from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import routes from './app/app.routes';
import { APP_BASE_HREF } from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import {JwtInterceptor} from '@app/guard/jwt.interceptor';
import {ErrorInterceptor} from '@app/guard/error.interceptor';
import {LoadingInterceptorService } from '@app/guard/loading.interceptor';

bootstrapApplication(
  App, 
  appConfig,
  { providers: [
      provideRouter(routes),
      {provide: APP_BASE_HREF, useValue: '/'},
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {  appearance: 'fill'} },
      provideHttpClient(
        withInterceptors([JwtInterceptor, ErrorInterceptor,LoadingInterceptorService ])),
  ]}
).catch((err) => console.error(err));





