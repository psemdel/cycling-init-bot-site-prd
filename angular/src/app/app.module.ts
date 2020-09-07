import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RoutingModule } from '@app/routing.module';
import {MatSelectModule} from '@angular/material/select';
import { APP_BASE_HREF } from '@angular/common';

import {MatMenuModule} from '@angular/material/menu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule } from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from '@app/app.component';
import { MenuComponent } from '@app/menu/menu.component';
import { MenuPersComponent } from '@app/menupers/menupers.component';

import { TopbarComponent } from '@app/topbar/topbar.component';
import { CreateRiderComponent } from '@app/create-rider/create-rider.component';
import { RequestListComponent } from '@app/request-list/request-list.component';
import { AllRequestListComponent } from '@app/all-request-list/all-request-list.component';
import { HomeComponent } from '@app/home/home.component';
import { LoginComponent} from '@app/login/login.component';
import { RegisterComponent} from '@app/register/register.component';
import { ImportClassificationComponent } from './import-classification/import-classification.component';
import { NationalOneChampComponent} from '@app/national-one-champ/national-one-champ.component';
import { NationalAllChampsComponent} from '@app/national-all-champs/national-all-champs.component';
import { StartListComponent} from '@app/start-list/start-list.component';
import { StagesComponent} from '@app/stages/stages.component';
import { RaceComponent} from '@app/race/race.component';
import { TeamComponent} from '@app/team/team.component';
import { UCIrankingComponent} from '@app/UCIranking/UCIranking.component';
import { SortDateComponent} from '@app/sort-date/sort-date.component';
import { SortNameComponent} from '@app/sort-name/sort-name.component';
import {LoadingComponent} from '@app/loading/loading.component';
import {ForgottenPassComponent} from '@app/forgotten-pass/forgotten-pass.component';
import {UserSettingsComponent} from '@app/user-settings/user-settings.component';
import {LogComponent} from '@app/log/log.component';
import {LogContentComponent} from '@app/logcontent/logcontent.component';
import {AlertComponent} from '@app/alert/alert.component';
import {RequestDetailsComponent } from '@app/request-details/request-details.component';
import {ResendActivationEmailComponent} from '@app/resend-activation-email/resend-activation-email.component';

import { NotFoundComponent } from './not-found/not-found.component';

import {JwtInterceptor} from './guard/jwt.interceptor';
import {ErrorInterceptor} from './guard/error.interceptor';
import {LoadingInterceptorService } from './guard/loading.interceptor';


@NgModule({
  imports:      [
  BrowserAnimationsModule,
  BrowserModule, 
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  RoutingModule,
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatDividerModule,
  MatSelectModule,
  MatProgressBarModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  ],
  declarations: [ AppComponent, MenuComponent,MenuPersComponent, TopbarComponent, CreateRiderComponent, HomeComponent,
                RequestListComponent, AllRequestListComponent,
                LoginComponent, RegisterComponent, ImportClassificationComponent,
                NationalOneChampComponent, NationalAllChampsComponent,
                StartListComponent, RaceComponent, ResendActivationEmailComponent,
                StagesComponent, TeamComponent, UCIrankingComponent,
                SortDateComponent, SortNameComponent, LoadingComponent,
                ForgottenPassComponent, UserSettingsComponent, 
                LogComponent, LogContentComponent, AlertComponent, MenuComponent,
                RequestDetailsComponent, NotFoundComponent 
                ],
  bootstrap:    [ AppComponent ],
  providers: [
      {provide: APP_BASE_HREF, useValue: '/'},
      {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true },
      MatMomentDateModule,
  ]
})
export class AppModule { }



