import { Component, signal, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeService } from './services/home.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  news: string;
  logmsg="List of potential improvements ";

  protected readonly title = signal('app');

  constructor(
        private homeService : HomeService
  ) {}


  ngOnInit() {
    this.homeService.get().subscribe(
    (datas:any)=> {
         datas.forEach(
            (data : any) => {this.news=data.news;},
            (err : any) => {this.news='';}
            )
    })
  }

}


