import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SheetComponent } from '../sheet/sheet.component';
import pq from "pqgrid";
import { BridgePalamService } from 'src/app/service/bridge-palam.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { VTKService } from '../three/vtk.service';

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
    private data: BridgePalamService,
    private vtk: VTKService
    ) { }

  ngOnInit(): void {
    if(this.data.get_vtk() == null){
      this.get_vtk('assets/default_bridge.vtk'); // デフォルトの vtk モデルをロードする
    } else {
      this.vtk.loadVYK(this.data.get_vtk());
    }
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
      { title: "value", width: 70, dataType: "float" }
    ],
    dataModel: {
      data: this.data.body
    },
    change: (evt, ui) => {
    }
  };

  /// モデルを plantFEM からダウンロードする
  public apply(): void {

    const inputJson = this.data.getPlantFEMJson();

    const f = new window.File([inputJson], "generate_bridge.json", { type: "application/json" })

    const data = new FormData();
    data.append('files', f, f.name);

    this.http.post(
      'https://plantfem.org:5555/bridge_creator/uploadfile',
      data,
      { responseType: 'text' }

      ).subscribe(event => {
        const domParser = new DOMParser();
        const htmlElement = domParser.parseFromString(event, 'text/html');
        const frm: HTMLCollection = htmlElement.getElementsByClassName("g-3");
        for(let i=0; i<frm.length; i++){
          const t: any = frm[i];
          const t0 = t[0];
          let url = 'https://plantfem.org:5555/bridge_creator/downloadfile/?filename=';
          url += t0.value;
          this.get_vtk(url);
          break;
        }
      },
      (error) => {
        alert("error get_vtk_link()");
        console.error(error);
      }
    );

  }

  private get_vtk(url: string): void {

    this.http.get(url,{ responseType: 'text' })
      .subscribe(event => {
        this.data.set_vtk(event);
        this.vtk.loadVYK(event);
        },
        (error) => {
          alert(error.message);
          console.error(error);
        }
      );

  }

}
