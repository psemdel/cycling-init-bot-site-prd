import {Component, Input, OnInit } from '@angular/core';
import {LogContentComponent } from '../logcontent/logcontent.component'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'log',
  templateUrl: 'log.component.html',
  imports: [MatIconModule]
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