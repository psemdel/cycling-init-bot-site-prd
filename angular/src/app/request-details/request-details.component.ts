import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BotRequestService} from '@ser/bot-request.service';
import {MonitoringService } from '@ser/monitoring.service';

import { Observable } from 'rxjs';

import { BotRequest} from '@app/models/models';
import {dic_of_display} from '@app/models/lists';

@Component({
  selector: 'request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']  
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
        data => {
          console.log(data);
          botrequest.status="run requested";
          this.monitoringService.start(botrequest.routine);
          this.reload();
        },
        error => console.log(error));
  }

  delete_rq(botrequest: BotRequest){
       this.botRequestService.deleteRq(botrequest.routine,botrequest.id)
          .subscribe(
            data => {
                  console.log("request deleted")
                  this.reload();
            },
            error => console.log(error));
  }
}