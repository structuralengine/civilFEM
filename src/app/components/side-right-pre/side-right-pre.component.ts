import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BridgePalamService } from 'src/app/service/bridge-palam.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from "pqgrid";

@Component({
  selector: 'app-side-right-pre',
  templateUrl: './side-right-pre.component.html',
  styleUrls: ['../side-right/side-right.component.scss']
})
export class SideRightPreComponent implements OnInit {

  @ViewChild("grid") grid!: SheetComponent;
  
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<SideRightPreComponent>,
    private data: BridgePalamService
    ) { }

  ngOnInit(): void {
  }

  // グリッドの設定
  options: pq.gridT.options = {
    width: 270,
    height: 430,
    locale: "jp",
    showTop: false,
    showHeader: false,
    // roundCorners: false,
    resizable: false,
    draggable: false,
    numberCell: { show: true },
    stripeRows: false,
    colModel: [
      { title: "key", width: 160, editable: false, dataType: "string" },
      { title: "value", width: 70, dataType: "integer" }
    ],
    dataModel: {
      data: this.data.body
    },
    change: (evt, ui) => {
    }
  };

}
