import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Angular Material
import {MatDialogModule} from '@angular/material/dialog';


import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreeComponent } from './components/three/three.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { SideLeftComponent } from './components/side-left/side-left.component';
import { SideRightBodyComponent } from './components/side-right-body/side-right-body.component';
import { SheetComponent } from './components/sheet/sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeComponent,

    CodeEditorComponent,
    SideLeftComponent,
    SideRightBodyComponent,
    SheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    BrowserAnimationsModule,

    MatDialogModule,

    CodemirrorModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
