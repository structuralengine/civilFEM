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
      { title: "value", width: 70, dataType: "float" }
    ],
    dataModel: {
      data: this.data.pre
    },
    change: (evt, ui) => {
      this.data.isCalcrated = false;
    }
  };


  public create_access_token(): void {

    this.get_vtk('assets/test_static.vtk', 0, true);
    return;

    if(this.data.isCalcrated===true){
      return; // 既に解析していたら、同じ解析は解析しない
    }

    const inputVTK = this.data.get_vtk();

    const f = new window.File([inputVTK], "generate_bridge.vtk", { type: "text/plain" })

    const data = new FormData();
    data.append('files', f, f.name);

    this.http.post(
      'https://plantfem.org:5555/upload_vtk_file/',
      data,
      { responseType: 'text' }

      ).subscribe(event => {
        const domParser = new DOMParser();
        const htmlElement = domParser.parseFromString(event, 'text/html');
        const frm: HTMLCollection = htmlElement.getElementsByClassName("g-3");
        for(let i=0; i<frm.length; i++){
          const t: any = frm[i];
          const t0 = t[0];
          const str_token: string = t0.value;
          this.calc_modal_analysis(str_token);
          break;
        }
      },
      (error) => {
        alert("error create_access_token()");
        console.error(error);
      }
    );

  }

  /// 解析開始する
  private calc_modal_analysis(token: string){
    const url = this.data.get_calc_url(token);
    this.http.get(url,{ responseType: 'text' })
      .subscribe(event => {
        this.parse_result_page(event);
        },
        (error) => {
          alert(error.message);
          console.error(error);
        }
      );
  }

  /// 解析結果のページを読み取る
  private parse_result_page(event: string): void{
    const domParser = new DOMParser();
    const htmlElement = domParser.parseFromString(event, 'text/html');
    const frm: NodeListOf<HTMLElement> = htmlElement.getElementsByName("filename");
    for(let i=0; i<frm.length; i++){
      const t: any = frm[i];
      const result_file: string = t.value;
      let url = 'https://plantfem.org:5555/downloadfile/?filename=';
      url += result_file;
      this.get_vtk(url, i, (i === frm.length-1));
    }
    // // 読み取り処理が終わったら閉じる
    // this.data.isCalcrated = true;
    // this.dialogRef.close(3);
  }

  /// 解析結果ファイルを取得する
  private get_vtk(url: string, index: number, close: boolean): void {

    this.http.get(url,{ responseType: 'text' })
      .subscribe(event => {
        this.data.set_result_vtk(event, index);
        if(close){
          // 読み取り処理が終わったら閉じる
          this.data.isCalcrated = true;
          this.dialogRef.close(3);
        }
      },
      (error) => {
        alert(error.message);
        console.error(error);
      });

  }
}
