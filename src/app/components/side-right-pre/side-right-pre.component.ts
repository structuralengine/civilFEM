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

    // const test_code = "\n<html>\n  \n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n    <meta name=\"description\" content=\"\">\n    <title>plantFEM-webAPI</title>\n    <link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\" integrity=\"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T\" crossorigin=\"anonymous\">\n  </head>\n\n\n<body>\n\n\n\n\n    <div class=\"d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 border-bottom shadow-sm\">\n      <h5 class=\"my-0 mr-md-auto font-weight-normal\">plantFEM APIs</h5>\n      <nav class=\"my-2 my-md-0 mr-md-3\">\n        <a class=\"btn btn btn-secondary\" href=\"#\" onclick=\"history.back(-1);return false;\">Go back</a>\n      </nav>\n      <nav class=\"my-2 my-md-0 mr-md-3\">\n        <a class=\"btn btn btn-secondary\" href=\"/\">Top page</a>\n      </nav>\n    </div>\n\n\nDownload results of static analysis ! <br>\n\n- Deformation & mean stress\n<form class=\"row g-3\" action=\"/downloadfile\" method=\"get\">\n    <div class=\"col-auto\">\n        <input name=\"filename\" type=\"text\"  class=\"form-control\" value=static_I1_uploaded_1988b5f7-85e8-4a98-a02b-0a359cd9b16c.vtk>\n    </div>\n    <div class=\"col-auto\">\n        <input type=\"submit\" class=\"btn btn-primary mb-2\" value=\"Download\">\n    </div>\n</form>\n\n- Deformation & s(1,1)\n<form class=\"row g-3\" action=\"/downloadfile\" method=\"get\">\n    <div class=\"col-auto\">\n        <input name=\"filename\" type=\"text\"  class=\"form-control\" value=static_11_uploaded_1988b5f7-85e8-4a98-a02b-0a359cd9b16c.vtk>\n    </div>\n    <div class=\"col-auto\">\n        <input type=\"submit\" class=\"btn btn-primary mb-2\" value=\"Download\">\n    </div>\n</form>\n\n\n- Deformation & s(2,2)\n<form class=\"row g-3\" action=\"/downloadfile\" method=\"get\">\n    <div class=\"col-auto\">\n        <input name=\"filename\" type=\"text\"  class=\"form-control\" value=static_22_uploaded_1988b5f7-85e8-4a98-a02b-0a359cd9b16c.vtk>\n    </div>\n    <div class=\"col-auto\">\n        <input type=\"submit\" class=\"btn btn-primary mb-2\" value=\"Download\">\n    </div>\n</form>\n\n\n- Deformation & s(3,3)\n<form class=\"row g-3\" action=\"/downloadfile\" method=\"get\">\n    <div class=\"col-auto\">\n        <input name=\"filename\" type=\"text\"  class=\"form-control\" value=static_33_uploaded_1988b5f7-85e8-4a98-a02b-0a359cd9b16c.vtk>\n    </div>\n    <div class=\"col-auto\">\n        <input type=\"submit\" class=\"btn btn-primary mb-2\" value=\"Download\">\n    </div>\n</form>\n\n\n\n- Deformation & s(1,2)\n<form class=\"row g-3\" action=\"/downloadfile\" method=\"get\">\n    <div class=\"col-auto\">\n        <input name=\"filename\" type=\"text\"  class=\"form-control\" value=static_12_uploaded_1988b5f7-85e8-4a98-a02b-0a359cd9b16c.vtk>\n    </div>\n    <div class=\"col-auto\">\n        <input type=\"submit\" class=\"btn btn-primary mb-2\" value=\"Download\">\n    </div>\n</form>\n\n\n- Deformation & s(1,3)\n<form class=\"row g-3\" action=\"/downloadfile\" method=\"get\">\n    <div class=\"col-auto\">\n        <input name=\"filename\" type=\"text\"  class=\"form-control\" value=static_13_uploaded_1988b5f7-85e8-4a98-a02b-0a359cd9b16c.vtk>\n    </div>\n    <div class=\"col-auto\">\n        <input type=\"submit\" class=\"btn btn-primary mb-2\" value=\"Download\">\n    </div>\n</form>\n\n\n- Deformation & s(2,3)\n<form class=\"row g-3\" action=\"/downloadfile\" method=\"get\">\n    <div class=\"col-auto\">\n        <input name=\"filename\" type=\"text\"  class=\"form-control\" value=static_23_uploaded_1988b5f7-85e8-4a98-a02b-0a359cd9b16c.vtk>\n    </div>\n    <div class=\"col-auto\">\n        <input type=\"submit\" class=\"btn btn-primary mb-2\" value=\"Download\">\n    </div>\n</form>\n\n\n</body>\n</html>\n    ";
    // this.parse_result_page(test_code);
    // return;

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
      this.get_vtk(url, i);
    }
    this.data.isCalcrated = true;
  }

  /// 解析結果ファイルを取得する
  private get_vtk(url: string, index: number): void {

    this.http.get(url,{ responseType: 'text' })
      .subscribe(event => {
        this.data.set_result_vtk(event, index);
        },
        (error) => {
          alert(error.message);
          console.error(error);
        }
      );

  }
}
