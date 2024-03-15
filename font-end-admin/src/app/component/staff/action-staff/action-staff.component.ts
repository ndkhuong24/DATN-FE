import { Component, OnInit } from '@angular/core';
import {GridApi, ICellRendererParams} from 'ag-grid-community';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {DiscountService} from '../../../service/discount.service';
import {ILoadingCellRendererAngularComp} from 'ag-grid-angular';
import {StaffService} from '../../../service/staff.service';
import {OrderDetailComponent} from '../../order/order-detail/order-detail.component';
import {DetailStaffComponent} from '../detail-staff/detail-staff.component';

@Component({
  selector: 'app-action-staff',
  templateUrl: './action-staff.component.html',
  styleUrls: ['./action-staff.component.css']
})
export class ActionStaffComponent implements OnInit, ILoadingCellRendererAngularComp {

  isMenuOpen: boolean = false;
  data: any = {
    // discountAdminDTO: {
    //   id: '',
    //   name: '',
    //   startDateStr: '',
    //   endDateStr: '',
    //   description: '',
    // },
    // reducedValue: '',
    // discountType: '',
  };
  gridApi: GridApi;
  constructor(private matDialog: MatDialog, private router: Router,
              private discountService: StaffService) {}
  ngOnInit(): void {
    console.log(this.data.idDiscount);
  }

  agInit(params): void {
    this.data = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  editItem(): void {
    console.log(this.data);
    this.router.navigate(['update-staff', this.data.id]);
  }
  // detail(dataOrder) {
  //   this.matDialog.open(OrderDetailComponent, {
  //     width: '150vh',
  //     height: '90vh',
  //     data: {
  //       data: dataOrder,
  //       staff: this.user
  //     }
  //   }).afterClosed().subscribe(res => {
  //     if (res === 'update-order') {
  //       this.ngOnInit();
  //     }
  //   });
  // }
  openDialog(): void {
      const dialogRef = this.matDialog.open(DetailStaffComponent, {
        width: '1200px',
        height: '600px',
        data: {staffData: this.data}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
}
