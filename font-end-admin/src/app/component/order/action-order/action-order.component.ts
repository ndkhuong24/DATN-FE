import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {OrderDetailComponent} from '../order-detail/order-detail.component';
import {MatDialog} from '@angular/material/dialog';
import {OrderService} from '../../../service/order.service';

@Component({
  selector: 'app-action-order',
  templateUrl: './action-order.component.html',
  styleUrls: ['./action-order.component.scss']
})
export class ActionOrderComponent implements OnInit, ICellRendererAngularComp {

  data: any;
  status: any;
  constructor(private matDialog: MatDialog, private orderService: OrderService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.status = this.data.status;
  }

  agInit(params: ICellRendererParams): void {
    this.data = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  openXemChiTiet() {
      this.matDialog.open(OrderDetailComponent, {
        width: '150vh',
        data: this.data
      });
  }

  cancelOrder() {
    this.orderService.cancelOrder(this.data).subscribe(res => {
    });
  }
}
