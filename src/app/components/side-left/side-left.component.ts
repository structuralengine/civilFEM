import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SideRightBodyComponent } from '../side-right-body/side-right-body.component';
import { VTKService } from '../three/vtk.service';

@Component({
  selector: 'app-side-left',
  templateUrl: './side-left.component.html',
  styleUrls: ['./side-left.component.scss']
})
export class SideLeftComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private vtk: VTKService) { }

  ngOnInit(): void {

    const url = 'assets/plantFEMtest.vtk';

    this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    })
    .subscribe(
      (response: any) => {
        this.vtk.loadVYK(response);
      },
      (error: any) => {
        alert(error);
      }
    );


    //
    this.openDialog();
  }



  public openDialog(): void {

    let rightSide: any = SideRightBodyComponent;

    this.dialog.open(rightSide, {
      width: '350px',
      position: { right: '10px', top: '70px' },
      hasBackdrop: false
    });
  }

}
