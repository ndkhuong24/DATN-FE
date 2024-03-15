import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { CreatDiscountComponent } from '../creat-discount/creat-discount.component';
import { DetailDiscountComponent } from '../detail-discount/detail-discount.component';
import { DiscountService } from 'src/app/service/discount.service';
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: 'app-action-discount',
  templateUrl: './action-discount.component.html',
  styleUrls: ['./action-discount.component.css'],
})
export class ActionDiscountComponent
  implements OnInit, ICellRendererAngularComp
{
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
  gridApi: GridApi; // Thêm gridApi để truy cập Ag-Grid API
  constructor(private matDialog: MatDialog, private router: Router,
              private discountService: DiscountService,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService) {}
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
    this.router.navigate(['/admin/edit-discount', this.data.id]);
  }
  detail(): void {
    this.router.navigate(['/admin/discount', this.data.id]);
  }
  delete(): void {
  Swal.fire({
              title: 'Bạn có muốn xóa giảm giá không?',
              icon: 'error',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Xóa'
            }).then((result) => {
    if (result.isConfirmed) {
      this.discountService.deleteDiscount(this.data.id).subscribe((response) => {
          this.router.navigateByUrl('/admin/discount');
        },
        error => {
          this.toastr.error('Xóa giảm giá thất bại');
        });
      location.reload();
    }
    Swal.fire({
      title: 'Xóa giảm giá thành công!',
      icon: 'success'
    });
});
}

}
