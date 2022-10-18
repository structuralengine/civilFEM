import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { threadId } from 'worker_threads';
import { VTKService } from '../three/vtk.service';

@Component({
  selector: 'app-side-left',
  templateUrl: './side-left.component.html',
  styleUrls: ['./side-left.component.scss']
})
export class SideLeftComponent implements OnInit {

  constructor(
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
  }



  public openDialog(id: string): void {


  }

}
