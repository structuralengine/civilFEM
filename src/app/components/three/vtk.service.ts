import { Injectable } from '@angular/core';
import * as THREE from 'three';
import * as d3 from 'd3';

import { BufferGeometry, Float32BufferAttribute } from 'three';
import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class VTKService {

  constructor(private scene: SceneService) {
  }

  public loadVYK(response: string) {

    this.scene.clear();

    const res = this.parseASCII(response);

    // box を生成する
    const geometry1: THREE.BufferGeometry = res.box;
    const material1 = new THREE.MeshBasicMaterial ( {
      vertexColors: true
    } );
    const mesh = new THREE.Mesh( geometry1, material1 );
    this.scene.add( mesh );

    // 境界線を生成する
    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });
    for(const geometry2 of res.edge){
      const line = new THREE.Line( geometry2, material );
      this.scene.add( line );
    }

    //
    this.scene.render();
  }


  private parseASCII( data: string ): { box: THREE.BufferGeometry, edge: THREE.BufferGeometry[]} {

    // connectivity of the triangles
    const indices: number[] = [];

    // 境界線のライン
    const edge_points: THREE.BufferGeometry[] = new Array();

    // triangles vertices
    const positions: number[] = [];

    // red, green, blue colors in the range 0 to 1
    const scalars = [];

    // pattern for connectivity, an integer followed by any number of ints
    // the first integer is the number of polygon nodes
    const patConnectivity = /^(\d+)\s+([\s\d]*)/;

    // pattern for detecting the end of a number sequence
    const patWord = /^[^\d.\s-]+/;

    // indicates start of vertex data section
    const patPOINTS = /^POINTS /;

    // indicates start of vertex data section
    const patCELLS = /^CELLS /;
    const Cell8Indices =  [ 0,2,1, 0,3,2, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,7,6, 2,3,7, 3,0,7, 0,4,7, 4,5,6, 4,6,7 ];
    const Cell8EdgeIndices = [ 4,0,1,5,6,2,1,5,4,0,3,7,6,2,3,7,6,5,4,7 ];

    // indicates start of vertex data section
    const patCELLDATA = /^CELL_DATA /;

    const lines = data.split( '\n' );
    let i = 0, ii = 0;

    // POINT 座標を取得
    while(ii < lines.length){
      let line = lines[ ii ].trim();
      if ( patPOINTS.exec( line ) !== null ) {
        const columns = line.split(' ');
        const rows = parseInt(columns[1]);
        while(( patWord.exec( lines[ ii ] ) !== null )){
          ii++;
        }
        for(let r=ii;r<ii+rows;r++){
          line = lines[ r ].trim();
          const result = line.split(' ');
          const x = parseFloat( result[ 0 ] );
          const y = parseFloat( result[ 1 ] );
          const z = parseFloat( result[ 2 ] );
          positions.push( x, y, z );
        }
        i = ii + rows;
        break;
      }
      ii++;
    }
    ii = i;

    // CELLS キューブ
    while(ii < lines.length){
      let line = lines[ ii ].trim();
      if ( patCELLS.exec( line ) !== null ) {
        const columns = line.split(' ');
        const rows = parseInt(columns[1]);
        while(( patWord.exec( lines[ ii ] ) !== null )){
          ii++;
        }
        for(let r=ii;r<ii+rows;r++){
          line = lines[ r ].trim();
          const result = patConnectivity.exec( line )
          // numVertices i0 i1 i2 ...
          const numVertices = parseInt( result[ 1 ] );
          const inds = result[ 2 ].split( /\s+/ );

          if ( numVertices == 8 ) {
            // キューブ
            Cell8Indices.forEach( i => indices.push(parseInt(inds[i])));
            // ライン
            const edge_indices: number[] = new Array();
            Cell8EdgeIndices.forEach( i => {
              edge_indices.push(parseInt(inds[i]))
            });
            const points: THREE.Vector3[] = [];
            edge_indices.forEach( i => {
              const x = positions[i * 3];
              const y = positions[i * 3 + 1];
              const z = positions[i * 3 + 2];
              points.push( new THREE.Vector3( x, y, z ) );
            });
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            edge_points.push(geometry);
          }
        }
        i = ii + rows;
        break;
      }
      ii++;
    }
    ii = i;

    // CELL_DATAを取得
    while(ii < lines.length){
      let line = lines[ ii ].trim();
      if ( patCELLDATA.exec( line ) !== null ) {
        const columns = line.split(' ');
        const rows = parseInt(columns[1]);
        // 冒頭の文字を読み飛ばす
        while(( patWord.exec( lines[ ii ] ) !== null )){
          ii++;
        }
        // get the vertices
        for(let r=ii;r<ii+rows;r++){
          line = lines[ r ].trim();
          const x = parseFloat( line );
          scalars.push( x );
        }
        i = ii + rows;
        break;
      }
      ii++;
    }
    ii = i;


    // box を生成する
    let geo_box = new BufferGeometry();
    geo_box.setIndex( indices );
    geo_box.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );

    const color = new THREE.Color(0xf0f0f0);

    if ( scalars.length === edge_points.length ){
      const max_value = Math.max(...scalars);
      const min_value = Math.min(...scalars);
      const newColors = [];
      // const color = d3.scaleOrdinal().domain(scalars);
      var f = d3.scaleLinear()
      .domain([min_value, 0, max_value])
      .range(["red", "white", "blue"])

      for( let i = 0; i < scalars.length; i ++ ){
        const scal = scalars[i];
        const sc = f(scal);
        const cls1 = d3.rgb(sc);
        const r = cls1.r/255;
        const g = cls1.g/255;
        const b = cls1.b/255;

        const scolor = new THREE.Color(r, g, b);

        for ( let j = 0; j < 36; j ++ ) {
          newColors.push( scolor.r, scolor.g, scolor.b );
        }
      }

      geo_box.setAttribute( 'color', new Float32BufferAttribute( newColors, 3 ) );

    } else {
      // デフォルトのカラー
      geo_box = geo_box.toNonIndexed();
      const attributes = geo_box.attributes;
      const position = attributes['position'];
      const count = position.count;
      const numTriangles = count / 3;

      const newColors = [];

      for ( let i = 0; i < numTriangles; i ++ ) {
        newColors.push( color.r, color.g, color.b );
        newColors.push( color.r, color.g, color.b );
        newColors.push( color.r, color.g, color.b );
      }

      geo_box.setAttribute( 'color', new Float32BufferAttribute( newColors, 3 ) );
    }


    return {
      box: geo_box,
      edge: edge_points
    };

  }


}
