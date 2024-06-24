import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { CreatDiscountComponent } from '../creat-discount/creat-discount.component';
import { DetailDiscountComponent } from '../detail-discount/detail-discount.component';
import { DiscountService } from 'src/app/service/discount.service';
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { EditDiscountComponent } from '../edit-discount/edit-discount.component';
import { DiscountComponent } from '../discount.component';
import { ok } from 'assert';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-action-discount',
  templateUrl: './action-discount.component.html',
  styleUrls: ['./action-discount.component.css'],
})

export class ActionDiscountComponent implements OnInit {
  isMenuOpen: boolean = false;
  data: any;
  params: any;

  gridApi: GridApi;

  constructor(
    private matDialog: MatDialog,
    private discountService: DiscountService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private discountComponent: DiscountComponent
  ) { }

  ngOnInit(): void { }

  agInit(params: any) {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  openUpdate(id: number): void {
    const dialogref = this.matDialog.open(EditDiscountComponent, {
      width: '250vh',
      height: '98vh',
      data: { idVoucher: id },
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'saveDiscount') {
        this.discountComponent.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  clickDetail(id: number): void {
    const dialogref = this.matDialog.open(DetailDiscountComponent, {
      width: '60%',
      height: '85%',
      data: { idVoucher: id },
    });
    dialogref.afterClosed().subscribe(() => {
      this.discountComponent.ngOnInit();
      this.cdr.detectChanges();
    });
  }

  deleteVoucher(id?: number) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa',
      text: 'Bạn sẽ không thể hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Thoát',
    }).then((response) => {
      if (response.isConfirmed) {
        this.discountService.deleteDiscount(id).subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {  // Thay 'ok' thành mã trạng thái HTTP 200
              this.discountComponent.ngOnInit();
              this.cdr.detectChanges();
              Swal.fire('Xóa', 'Xóa thành công', 'success');
            } else {
              Swal.fire('Lỗi', 'Có lỗi xảy ra khi xóa', 'error');
            }
          },
        );
      }
    })
  }

  updateIdel(id?: number) {
    this.discountService.getDetailDiscount(id).subscribe((response: any[]) => {
      let discountCurrent;
      if (Array.isArray(response) && response.length > 0) {
        discountCurrent = response[0];
      } else if (response && typeof response === 'object') {
        discountCurrent = response;
      } else {
        return;
      }

      if (discountCurrent.idel === 0) {
        Swal.fire({
          title: 'Bạn có chắc muốn kích hoạt voucher không',
          text: 'Bạn sẽ không thể hoàn tác',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Kích hoạt',
          cancelButtonText: 'Thoát',
        }).then((result) => {
          if (result.isConfirmed) {
            this.discountService.KichHoat(id).subscribe(() => {
              this.discountComponent.ngOnInit();
              this.cdr.detectChanges();
            });
            Swal.fire('Kích hoạt', 'Kích hoạt thành công', 'success');
          }
        })
      } else {
        Swal.fire({
          title: 'Bạn có chắc muốn huỷ kích hoạt voucher không',
          text: 'Bạn sẽ không thể hoàn tác',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Hủy kích hoạt',
          cancelButtonText: 'Thoát',
        }).then((result) => {
          if (result.isConfirmed) {
            this.discountService.KichHoat(id).subscribe(() => {
              this.discountComponent.ngOnInit();
              this.cdr.detectChanges();
            });
            Swal.fire('Hủy kích hoạt', 'Hủy kích hoạt thành công', 'success');
          }
        })
      }
    })
  }

  // editItem(): void {
  //   console.log(this.data);
  //   this.router.navigate(['/admin/edit-discount', this.data.id]);
  // }

  // detail(): void {
  //   this.router.navigate(['/admin/discount', this.data.id]);
  // }

  // delete(): void {
  //   Swal.fire({
  //     title: 'Bạn có muốn xóa giảm giá không?',
  //     icon: 'error',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Xóa'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.discountService.deleteDiscount(this.data.id).subscribe((response) => {
  //         this.router.navigateByUrl('/admin/discount');
  //       },
  //         error => {
  //           this.toastr.error('Xóa giảm giá thất bại');
  //         });
  //       location.reload();
  //     }
  //     Swal.fire({
  //       title: 'Xóa giảm giá thành công!',
  //       icon: 'success'
  //     });
  //   });
  // }

}
