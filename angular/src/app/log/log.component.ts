import {Component, Input, OnInit } from '@angular/core';
import {LogContentComponent } from '@app/logcontent/logcontent.component'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'log',
  templateUrl: 'log.component.html',
})
export class LogComponent implements OnInit {
  @Input() txt: string;
  @Input() name: string;
  display: string;

  constructor(public dialog: MatDialog) {
  }
  
  ngOnInit() {
     if (this.name || this.name==""){
         this.display=this.name;
      }else{
        this.display="Log"; //icon
     }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data=this.txt;
  
    this.dialog.open(LogContentComponent, dialogConfig);
  }
}