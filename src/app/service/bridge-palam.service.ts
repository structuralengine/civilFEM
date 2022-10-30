import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BridgePalamService {

  constructor() { }

  public body: any = [

      ["NumPiers_x", 2],
      ["NumPiers_y", 3],
      ["Width", 10.0],
      ["Length", 35.0],
      ["Height", 12.0],
      ["PierThickness", 1.0],
      ["Divisions_x", 3],
      ["Divisions_y", 3],
      ["Divisions_z", 3],
      ["GirderWidth", 11.0],
      ["GirderThickness", 0.3],
      ["GirderEdgeHeight", 1.0],
      ["GirderEdgeThickness", 0.25]
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


  ///
  public pre: any = [
    ["Young's modulus (kPa)", 10000000.00],
    ["Poisson's ratio", 0.300],
    ["Density (t/m^3)", 1.800],
    ["Ground level (m)", 0.100],
    ["Fixed boundary (x-min) (m)", -100000.0],
    ["Fixed boundary (x-max) (m)", 100000.0],
    ["Fixed boundary (y-min) (m)", -100000.0],
    ["Fixed boundary (y-max) (m)", 3100000.0]
  ];

  public get_calc_url(token: string): string {

    let result = 'https://plantfem.org:5555/static_analysis/uploadfile/';

    result += "?YoungModulus="      + this.pre[0][1];
    result += "&PoissonRatio="      + this.pre[1][1];
    result += "&Density="           + this.pre[2][1];
    result += "&ground_level="      + this.pre[3][1];
    result += "&fix_boundary_xmin=" + this.pre[4][1];
    result += "&fix_boundary_xmax=" + this.pre[5][1];
    result += "&fix_boundary_ymin=" + this.pre[6][1];
    result += "&fix_boundary_ymax=" + this.pre[7][1];
    result += "&filename="          + token

    return result;

  }

  /// 解析結果 results of static analysis !
  //0 - Deformation & mean stress
  //1 - Deformation & s(1,1)
  //2 - Deformation & s(2,2)
  //3 - Deformation & s(3,3)
  //4 - Deformation & s(1,2)
  //5 - Deformation & s(1,3)
  //6 - Deformation & s(2,3)
  private result_vtk: string[] = new Array();
  public get_result_vtk(index: number): string {
    return this.result_vtk[index];
  }
  public set_result_vtk(_vtk: string, index: number) {
    this.result_vtk[index] = _vtk;
  }

}
