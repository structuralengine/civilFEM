import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SheetComponent } from '../sheet/sheet.component';
import pq from "pqgrid";
import { BridgePalamService } from 'src/app/service/bridge-palam.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-side-right-body',
  templateUrl: './side-right-body.component.html',
  styleUrls: ['../side-right/side-right.component.scss']
})
export class SideRightBodyComponent implements OnInit {

  @ViewChild("grid") grid!: SheetComponent;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<SideRightBodyComponent>,
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

  /// モデルを plantFEM からダウンロードする



  public click(): void {

    const inputJson = this.data.getPlantFEMJson();
    const blob = new window.Blob([inputJson], { type: "text/plain" });
    // const file = new File([blob], "generate_bridge.json", { type: "application/octet-stream" })

    const data = new FormData();
    // data.append('upfile', file, file.name);
    data.append("files", blob, "generate_bridge.json")

    this.http.post(
      'https://plantfem.org:5555/bridge_creator/uploadfile',
      data,
      {
        headers: new HttpHeaders({
          "Content-Type": "multipart/form-data;",
          "Host": "plantfem.org:5555"
        }),
      }
    ).subscribe(event => {

      console.log(event);
      // if ( event.type === HttpEventType.UploadProgress ) {
      //   console.log(Math.round((100 * event.loaded) / event.total));
      // }

      // if ( event.type === HttpEventType.Response ) {
      //   console.log(event.body);
      // }

    },
    (error) => {
      alert(error);
      console.error(error);
    })
    ;
  }


}
