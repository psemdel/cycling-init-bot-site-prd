import { Component, OnInit } from '@angular/core';
import {HomeInfo} from '@app/models/models';
import {HomeService } from '@ser/home.service';
import { map, tap, first} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  news: string;
  logmsg="List of potential improvements ";

  constructor(
      private homeService :HomeService 
  ) { }

  ngOnInit() {
    this.homeService.get()
    .subscribe(
    datas=> {
         datas.forEach(
            data => {this.news=data.news;},
            err => {this.news='';}
            )
    })
  }
}