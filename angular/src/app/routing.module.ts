import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CreateRiderComponent } from '@app/create-rider/create-rider.component';
import {HomeComponent} from '@app/home/home.component';
import { AppComponent } from '@app/app.component';
import { RequestListComponent } from '@app/request-list/request-list.component';
import { AllRequestListComponent } from '@app/all-request-list/all-request-list.component';
import { LoginComponent} from '@app/login/login.component';
import { RegisterComponent} from '@app/register/register.component';
import { ImportClassificationComponent } from '@app/import-classification/import-classification.component';
import { NationalOneChampComponent} from '@app/national-one-champ/national-one-champ.component';
import { NationalAllChampsComponent} from '@app/national-all-champs/national-all-champs.component';
import { StartListComponent} from '@app/start-list/start-list.component';
import { StagesComponent} from '@app/stages/stages.component';
import { RaceComponent} from '@app/race/race.component';
import { TeamComponent} from '@app/team/team.component';
import { UCIrankingComponent} from '@app/UCIranking/UCIranking.component';
import { SortDateComponent} from '@app/sort-date/sort-date.component';
import { SortNameComponent} from '@app/sort-name/sort-name.component';
import {ForgottenPassComponent} from '@app/forgotten-pass/forgotten-pass.component';
import {UserSettingsComponent} from '@app/user-settings/user-settings.component';
import { NotFoundComponent } from '@app/not-found/not-found.component';
import {ResendActivationEmailComponent} from '@app/resend-activation-email/resend-activation-email.component';


import {AuthGuard} from './guard/auth.guard';
import {AuthGuardStaff} from './guard/authstaff.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'national-all-champs', component: NationalAllChampsComponent, canActivate: [AuthGuardStaff] },
    { path: 'national-one-champ', component: NationalOneChampComponent, canActivate: [AuthGuard] },
    { path: 'create_rider', component: CreateRiderComponent, canActivate: [AuthGuard] },
    { path: 'race', component: RaceComponent, canActivate: [AuthGuard] },
    { path: 'stages', component: StagesComponent, canActivate: [AuthGuard] },
    { path: 'start_list', component: StartListComponent, canActivate: [AuthGuard] },
    { path: 'team', component: TeamComponent, canActivate: [AuthGuard] },
    { path: 'UCIranking', component: UCIrankingComponent, canActivate: [AuthGuard] },
    { path: 'sort_date', component: SortDateComponent, canActivate: [AuthGuard] },
    { path: 'sort_name', component: SortNameComponent, canActivate: [AuthGuard] },
    { path: 'import_classification', component: ImportClassificationComponent, canActivate: [AuthGuardStaff] },
    { path: 'request_list', component: RequestListComponent, canActivate: [AuthGuard] },
    { path: 'all_request_list', component: AllRequestListComponent, canActivate: [AuthGuardStaff] },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgotten', component:     ForgottenPassComponent },
    { path: 'user_settings', component:     UserSettingsComponent },
    { path: 'resend_activation_email', component: ResendActivationEmailComponent, canActivate: [AuthGuardStaff] },
    { path: '**',component:  NotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }


