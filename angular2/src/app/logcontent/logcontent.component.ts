import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'logcontent',
  templateUrl: 'logcontent.component.html',
  styleUrls: ['logcontent.component.css']
})
export class LogContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
}