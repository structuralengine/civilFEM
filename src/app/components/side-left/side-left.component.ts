import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-side-left',
  templateUrl: './side-left.component.html',
  styleUrls: ['./side-left.component.scss']
})
export class SideLeftComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  
  }



  public openDialog(id: string): void {

    let rightSide: any = null;

    if(rightSide==null)
      return;

    this.dialog.open(rightSide, {
      width: '350px',
      position: { right: '10px', top: '70px' },
      hasBackdrop: false
    });


  }

}
