import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BotRequestService} from '../services/bot-request.service';
import {MonitoringService } from '../services/monitoring.service';

import { Observable } from 'rxjs';

import { BotRequest} from '../models/models';
import {dic_of_display} from '../models/lists';

import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css'],
  imports: [MatIconModule]
})
export class RequestDetailsComponent implements OnInit {
   @Input() tbotrequests: Observable<BotRequest[]>;
   @Input() title: string;
   @Input() routine: string;
   @Input() admin: boolean;
   
   @Output() refresh = new EventEmitter<any>();
   
   result_id_col=false; name_col=false; nameyear_col=false; id_col=false;
   year_col=false; year_begin_col=false;
   column: string;
 
  constructor(private botRequestService: BotRequestService,
              private monitoringService: MonitoringService
   ) { }

  ngOnInit() {
   this.column=dic_of_display[this.routine];
   switch(this.column){
    case "name": {this.nameyear_col=true; this.result_id_col=true; break;}
    case "id":{this.id_col=true; break;}
    case "year": {this.year_col=true; break;}
    case "year_begin": {this.year_begin_col=true; break;}
    case "name only": {this.name_col=true; this.result_id_col=true; break;}
   }
  }
  
  reload(){
       this.refresh.emit(true);
   }

  run(botrequest : BotRequest) {
    this.botRequestService.runRq(botrequest)
      .subscribe(
        (data : any) => {
          console.log(data);
          botrequest.status="run requested";
          this.monitoringService.start(botrequest.routine);
          this.reload();
        },
        (error : any) => console.log(error));
  }

  delete_rq(botrequest: BotRequest){
       this.botRequestService.deleteRq(botrequest.routine,botrequest.id)
          .subscribe(
            (data : any) => {
                  console.log("request deleted")
                  this.reload();
            },
            (error : any) => console.log(error));
  }
}