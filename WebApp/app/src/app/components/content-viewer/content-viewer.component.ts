import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-content-viewer',
  templateUrl: './content-viewer.component.html',
  styleUrls: ['./content-viewer.component.scss']
})
export class ContentViewerComponent implements OnInit {
  @Input() link;
  @Input() image;
  
  constructor() { }

  ngOnInit() {
  }

  // get link(): any { 
  //   return this._link;
  // }
  
  // @Input()
  // set link(val: any) {
  //   this._link = val;
  // }
}
