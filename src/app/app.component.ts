import { ViewChild, ElementRef, Component } from '@angular/core';

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyDataReader from 'vtk.js/Sources/IO/Legacy/PolyDataReader';

import { Mesh, readLocalFile, writeLocalFile } from 'itk-wasm'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  @ViewChild('content', { read: ElementRef }) content: ElementRef;

  fullscreenRenderWindow = null;

  ngAfterViewInit(): void {

    readLocalFile("/assets/test.vtk").then((value: any) => {
      console.log(value);
    })



    this.fullscreenRenderWindow = vtkFullScreenRenderWindow.newInstance();
    const renderer = this.fullscreenRenderWindow.getRenderer();
    const renderWindow = this.fullscreenRenderWindow.getRenderWindow();
    const mapper = vtkMapper.newInstance();


    const reader = vtkPolyDataReader.newInstance();
    reader.setUrl("/assets/test.vtk").then(() => {
      reader.loadData().then(() => {

        const port = reader.getOutputPort();
        mapper.setInputConnection(port);

        renderer.resetCamera();
        renderWindow.render();
      });

    });

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    renderer.addActor(actor);

  }

}
