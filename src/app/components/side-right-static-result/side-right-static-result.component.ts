import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-right-static-result',
  templateUrl: './side-right-static-result.component.html',
  styleUrls: ['../side-right/side-right.component.scss']
})
export class SideRightStaticResultComponent implements OnInit {

  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor() { }

  ngOnInit(): void {
  }

}
