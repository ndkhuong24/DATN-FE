import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { VoucherShipService } from '../../../service/voucher-ship.service';
import { VoucherShipComponent } from '../voucher-ship.component';
import { DetailVoucherShipComponent } from '../detail-voucher-ship/detail-voucher-ship.component';
import { EditVoucherShipComponent } from '../edit-voucher-ship/edit-voucher-ship.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-action-voucher-ship',
  templateUrl: './action-voucher-ship.component.html',
  styleUrls: ['./action-voucher-ship.component.css'],
})
export class ActionVoucherShipComponent implements OnInit {
  isMenuOpen: boolean = false;
  data: any;
  params: any;
  role: 'ADMIN' | 'USER' | 'STAFF';

  constructor(
    private matdialog: MatDialog,
    private voucherShipService: VoucherShipService,
    private cdr: ChangeDetectorRef,
    private voucherShipComponent: VoucherShipComponent,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    var userjson = localStorage.getItem("users");
    var users = JSON.parse(userjson);
    this.role = users.role;
  }

  agInit(params: any) {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  openUpdate(id: number): void {
    if (this.role === 'ADMIN') {
      const dialogref = this.matdialog.open(EditVoucherShipComponent, {
        width: '250vh',
        height: '98vh',
        data: { idVoucherShip: id },
      });
      dialogref.afterClosed().subscribe((result) => {
        if (result === 'saveVoucherShip') {
          this.voucherShipComponent.ngOnInit();
          this.cdr.detectChanges();
        }
      });
    } else if (this.role === 'STAFF') {
      this.toastr.error('Bạn không có quyền truy cập cập nhật', 'Lỗi');
    }
  }

  deleteVoucherShip(id?: number) {
    if (this.role === 'ADMIN') {
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
          this.voucherShipService.deleteVoucher(id).subscribe(() => {
            this.voucherShipComponent.ngOnInit();
            this.cdr.detectChanges();
          });
          Swal.fire('Xóa', 'Xóa thành công', 'success');
        }
      });
    } else if (this.role === 'STAFF') {
      this.toastr.error('Bạn không có quyền xóa', 'Lỗi');
    }
  }

  clickDetail(id: number): void {
    const dialogref = this.matdialog.open(DetailVoucherShipComponent, {
      width: '60%',
      height: '85%',
      data: { idVoucherShip: id },
    });
    dialogref.afterClosed().subscribe(() => {
      this.voucherShipComponent.ngOnInit();
      this.cdr.detectChanges();
    });
  }

  updateIdel(id?: number) {
    this.voucherShipService
      .getDetailVoucher(id)
      .subscribe((response: any[]) => {
        let voucherCurrent;
        if (Array.isArray(response) && response.length > 0) {
          voucherCurrent = response[0];
        } else if (response && typeof response === 'object') {
          voucherCurrent = response;
        } else {
          console.log('Invalid response format');
          return;
        }

        if (voucherCurrent.idel === 0) {
          Swal.fire({
            title: 'Bạn có chắc muốn kích hoạt voucher không',
            text: 'Bạn sẽ không thể hoàn tác',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Kích hoạt',
            cancelButtonText: 'Thoát',
          }).then((response) => {
            if (response.isConfirmed) {
              this.voucherShipService.KichHoat(id).subscribe(() => {
                this.voucherShipComponent.ngOnInit();
                this.cdr.detectChanges();
              });
              Swal.fire('Kích hoạt', 'Kích hoạt thành công', 'success');
            }
          });
        } else {
          Swal.fire({
            title: 'Bạn có chắc muốn hủy kích hoạt voucher không',
            text: 'Bạn sẽ không thể hoàn tác',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Kích hoạt',
            cancelButtonText: 'Thoát',
          }).then((response) => {
            if (response.isConfirmed) {
              this.voucherShipService.KichHoat(id).subscribe(() => {
                this.voucherShipComponent.ngOnInit();
                this.cdr.detectChanges();
              });
              Swal.fire('Hủy kích hoạt', 'Hủy kích hoạt thành công', 'success');
            }
          });
        }
      });
  }
}
