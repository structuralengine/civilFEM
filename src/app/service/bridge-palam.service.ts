import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BridgePalamService {

  constructor() { }

  public body: any = [
    ["NumPiers_x", 2],
    ["NumPiers_y", 3],
    ["Width", 10.00],
    ["Length", 35.00],
    ["Height", 12.00],
    ["PierThickness", 1.00],
    ["Divisions_x", 3],
    ["Divisions_y", 3],
    ["Divisions_z", 3],
    ["NumMiddlePier", 2],
    ["MiddlePierHeights", "3.00, 7.00"],
    ["GirderWidth", 11.000],
    ["GirderThickness", 0.30],
    ["GirderEdgeHeight", 1.00],
    ["GirderEdgeThickness", 0.2500],
  ];


  public getPlantFEMJson(): string {
   const result = {};
    for(const column of this.body){
      const key: string = column[0];
      let value = column[1];

      if(typeof value === 'string'){
        const list: number[] = [];
        for(const v of value.split(',')){
          list.push(parseFloat(v));
        }
        result[key] = list;
      }else{
        result[key] = value;
      }
    }
    return JSON.stringify(result, null, 2);
  }

  // サーバーで生成された vtkファイルを保存する
  private vtk: string = null;
  public get_vtk(): string {
    return this.vtk;
  }
  public set_vtk(_vtk: string): void {
    this.vtk = _vtk;
  }


}
