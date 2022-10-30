import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SideRightBodyComponent } from '../side-right-body/side-right-body.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public dummyFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  public isLinear = false;

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder) { }


  ngOnInit(): void {
        //
        const dialog = this.openDialog(SideRightBodyComponent);
        dialog.afterClosed().subscribe( (result:any) => {
          this.isLinear = false;
        });
  }

  public openDialog(target: any): MatDialogRef<unknown, any> {

    const rightSide: any = target;
    const h = window.innerHeight - 100;

    const dialog = this.dialog.open(rightSide, {
      width: '350px',
      height: h + 'px',
      position: { right: '10px', top: '70px' },
      hasBackdrop: false
    });

    return dialog;

  }

  public open(evt: any) {
    const file = evt.target.files[0];
    evt.target.value = "";
    this.fileToText(file)
      .then((text: string) => {
        const jsonData: {} = JSON.parse(text);
      })
      .catch((err: any) => {
        alert(err);
      });
  }

  private fileToText(file: any): any {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  // ファイルを保存
  public save(): void {
    const inputJson: string = JSON.stringify({});
    const blob = new window.Blob([inputJson], { type: "text/plain" });
    // FileSaver.saveAs(blob, "test.json");
  }

  // モデルをダウンロードする
  public download() {

  }


}
