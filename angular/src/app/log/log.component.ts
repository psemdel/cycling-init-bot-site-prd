import {Component, Inject, Input} from '@angular/core';
import {BotRequest} from '@app/models/models';
import {LogContentComponent } from '@app/logcontent/logcontent.component'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'log',
  templateUrl: 'log.component.html',
})
export class LogComponent {
  constructor(public dialog: MatDialog) {}
  
  @Input() txt: string;

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data=this.txt;
  
    this.dialog.open(LogContentComponent, dialogConfig);
  }
}