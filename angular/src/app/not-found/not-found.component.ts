import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, take, switchMap, map  } from 'rxjs/operators';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
})

export class NotFoundComponent implements OnInit {
    path: string;
    
    constructor(
        private route: ActivatedRoute,
    ) { }
    
    ngOnInit() {
      this.route.data.pipe(take(1))
        .subscribe((data: { path: string }) => {
          this.path = data.path;
          console.log(this.path);
        });
    }


}
