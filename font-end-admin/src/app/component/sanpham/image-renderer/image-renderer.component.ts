import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-image-renderer',
  templateUrl: './image-renderer.component.html',
  styleUrls: ['./image-renderer.component.css']
})
export class ImageRendererComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
