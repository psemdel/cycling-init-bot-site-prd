import { Routes } from '@angular/router';

import {App} from './app'
import { HomeComponent } from './home/home.component';
import { CreateRiderComponent } from './create-rider/create-rider.component';
import { RequestListComponent } from './request-list/request-list.component';
import { AllRequestListComponent } from './all-request-list/all-request-list.component';
import { LoginComponent} from './login/login.component';
import { RegisterComponent} from './register/register.component';
import { ImportClassificationComponent } from './import-classification/import-classification.component';
import { NationalOneChampComponent} from './national-one-champ/national-one-champ.component';
import { NationalAllChampsComponent} from './national-all-champs/national-all-champs.component';
import { StartListComponent} from './start-list/start-list.component';
import { StagesComponent} from './stages/stages.component';
import { RaceComponent} from './race/race.component';
import { TeamComponent} from './team/team.component';
import { NationalTeamComponent} from './national-team/national-team.component';
import {NationalTeamAllComponent} from './national-team-all/national-team-all.component';
import { UCIrankingComponent} from './UCIranking/UCIranking.component';
import { SortDateComponent} from './sort-date/sort-date.component';
import { SortNameComponent} from './sort-name/sort-name.component';
import { TeamImporterComponent} from './team-importer/team-importer.component';
import { FinalResultComponent} from './final-result/final-result.component';
import { UpdateResultComponent} from './update-result/update-result.component';

import {ForgottenPassComponent} from './forgotten-pass/forgotten-pass.component';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {ResendActivationEmailComponent} from './resend-activation-email/resend-activation-email.component';

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
    { path: 'team_importer', component: TeamImporterComponent, canActivate: [AuthGuard] },
    { path: 'team', component: TeamComponent, canActivate: [AuthGuard] },
    { path: 'national_team', component: NationalTeamComponent, canActivate: [AuthGuard] },
    { path: 'national_team_all', component: NationalTeamAllComponent, canActivate: [AuthGuardStaff] },
    { path: 'UCIranking', component: UCIrankingComponent, canActivate: [AuthGuard] },
    { path: 'sort_date', component: SortDateComponent, canActivate: [AuthGuard] },
    { path: 'sort_name', component: SortNameComponent, canActivate: [AuthGuard] },
    { path: 'import_classification', component: ImportClassificationComponent, canActivate: [AuthGuard] },
    { path: 'final_result',component:FinalResultComponent, canActivate: [AuthGuard] },
    { path: 'update_result',component:UpdateResultComponent, canActivate: [AuthGuard] },
    { path: 'request_list', component: RequestListComponent, canActivate: [AuthGuard] },
    { path: 'all_request_list', component: AllRequestListComponent, canActivate: [AuthGuardStaff] },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgotten', component:     ForgottenPassComponent },
    { path: 'user_settings', component:     UserSettingsComponent },
    { path: 'resend_activation_email', component: ResendActivationEmailComponent, canActivate: [AuthGuardStaff] },
    { path: '**',component:  NotFoundComponent},
];

export default routes;