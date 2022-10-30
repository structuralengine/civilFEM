import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SideRightBodyComponent } from '../side-right-body/side-right-body.component';


@Component({
  selector: 'app-side-left',
  templateUrl: './side-left.component.html',
  styleUrls: ['./side-left.component.scss']
})
export class SideLeftComponent implements OnInit {

  public firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  public secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  public isLinear = true;

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

}
