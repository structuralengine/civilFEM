import { Component, OnInit } from '@angular/core';
import { BridgePalamService } from 'src/app/service/bridge-palam.service';
import { VTKService } from '../three/vtk.service';

@Component({
  selector: 'app-side-right-static-result',
  templateUrl: './side-right-static-result.component.html',
  styleUrls: ['../side-right/side-right.component.scss']
})
export class SideRightStaticResultComponent implements OnInit {

  favoriteSeason: string;
  seasons: any[] = [
    'Deformation & mean stress',
    'Deformation & s(1,1)',
    'Deformation & s(2,2)',
    'Deformation & s(3,3)',
    'Deformation & s(1,2)',
    'Deformation & s(1,3)',
    'Deformation & s(2,3)'
  ];

  constructor(
    private data: BridgePalamService,
    private vtk: VTKService
    ) { }

  ngOnInit(): void {
    this.favoriteSeason = this.seasons[0];
    this.radioChange();
  }

  public radioChange() {
    let i = 0;
    for(i=0;i<this.seasons.length; i++){
      if(this.seasons[i]===this.favoriteSeason)
        break;
    }
    const str_vtk = this.data.get_result_vtk(i);
    this.vtk.loadVYK(str_vtk);
  }

}
