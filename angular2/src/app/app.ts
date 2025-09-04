import { Component, signal, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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


