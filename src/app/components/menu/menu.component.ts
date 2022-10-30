import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SideRightBodyComponent } from '../side-right-body/side-right-body.component';
import { SideRightPreComponent } from '../side-right-pre/side-right-pre.component';
import { SideRightStaticResultComponent } from '../side-right-static-result/side-right-static-result.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @ViewChild('stepper') private myStepper: MatStepper;

  public dummyFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  private currentDialog: MatDialogRef<unknown, any>;

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.openBodyDialog();
  }

  public stepChange(event: any): void {
    this.currentDialog.close(-1 * (event.selectedIndex + 1));
  }

  // 3Dモデルの設定画面を開く
  private openBodyDialog(): void {
    this.currentDialog = this.openDialog(SideRightBodyComponent);
    this.currentDialog.afterClosed().subscribe((result: number) => {
      // 3Dモデルが閉じられた時
      if (Math.abs(result) === 2) {
        if (result > 0) this.myStepper.next();
        this.openPreDialog();
      } else if (Math.abs(result) === 3) {
        if (result > 0) {
          this.myStepper.next();
          this.myStepper.next();
        }
        this.openStaticResultDialog();
      }
    });
  }

  // 解析条件の設定画面を開く
  private openPreDialog(): void {
    this.currentDialog = this.openDialog(SideRightPreComponent);
    this.currentDialog.afterClosed().subscribe((result: number) => {
      // 解析条件が閉じられた時
      if (Math.abs(result) === 1) {
        if (result > 0) this.myStepper.previous();
        this.openBodyDialog();
      } else if (Math.abs(result) === 3) {
        if (result > 0) this.myStepper.next();
        this.openStaticResultDialog();
      }
    });
  }

  // 解析結果の画面を開く
  private openStaticResultDialog(): void {
    this.currentDialog = this.openDialog(SideRightStaticResultComponent);
    this.currentDialog.afterClosed().subscribe((result: number) => {
      // 解析条件が閉じられた時
      if (Math.abs(result) === 2) {
        if (result > 0) this.myStepper.previous();
        this.openPreDialog();
      } else if (Math.abs(result) === 1) {
        if (result > 0) {
          this.myStepper.previous();
          this.myStepper.previous();
        }
        this.openBodyDialog();
      }
    });
  }

  private openDialog(target: any): MatDialogRef<unknown, any> {

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


}
