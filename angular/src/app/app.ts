import { Component, signal,  } from '@angular/core';
import { TopbarComponent } from './topbar/topbar.component';
import { LoadingComponent } from './loading/loading.component';
import {RouterModule} from '@angular/router';
import { AlertComponent } from './alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [
    TopbarComponent, 
    LoadingComponent,
    RouterModule,
    AlertComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('app');
}


