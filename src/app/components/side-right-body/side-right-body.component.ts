import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SheetComponent } from '../sheet/sheet.component';
import pq from "pqgrid";
import { BridgePalamService } from 'src/app/service/bridge-palam.service';

@Component({
  selector: 'app-side-right-body',
  templateUrl: './side-right-body.component.html',
  styleUrls: ['../side-right/side-right.component.scss']
})
export class SideRightBodyComponent implements OnInit {

  @ViewChild("grid") grid!: SheetComponent;

  constructor(
    public dialogRef: MatDialogRef<SideRightBodyComponent>,
    private data: BridgePalamService
    ) { }

  ngOnInit(): void {
  }

    // グリッドの設定
    options: pq.gridT.options = {

      // showTop: false,
      // reactive: true,
      // sortable: false,
      // scrollModel: {
      //   horizontal: true
      // },
      locale: "jp",
      // height: 200,
      // numberCell: {
      //   show: true, // 行番号
      //   width:45
      // },
      // colModel: this.columnHeaders,
      dataModel: {
        data: this.data.body
      },
      change: (evt, ui) => {
      }
    };

}
