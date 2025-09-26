import { Component, OnInit } from '@angular/core';
import {HomeService } from '../services/home.service';
import {LogComponent} from '../log/log.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [LogComponent]
})
export class HomeComponent implements OnInit {
  news: string;
  logmsg="List of potential improvements ";

  constructor(
      private homeService :HomeService 
  ) { }

  ngOnInit() {
    this.homeService.get().subscribe(
    (datas:any)=> {
         datas.forEach( //actually there should be only one news, if we want to provide several and concat them, then we should adapt this code
            (data : any) => {this.news=data.news;},
            (err : any) => {this.news='';}
            )
    })
  }
}