import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VoucherService } from 'src/app/service/voucher.service';
import { DetailVoucherComponent } from '../detail-voucher/detail-voucher.component';
import { ICellRendererAngularComp } from "ag-grid-angular";
import Swal from "sweetalert2";
import { VoucherComponent } from '../voucher.component';
import { EditVoucherComponent } from '../edit-voucher/edit-voucher.component';

@Component({
  selector: 'app-action-voucher',
  templateUrl: './action-voucher.component.html',
  styleUrls: ['./action-voucher.component.css'],
})

export class ActionVoucherComponent implements OnInit, ICellRendererAngularComp {

  isMenuOpen: boolean = false;
  data: any;
  params: any;

  constructor(
    private matdialog: MatDialog,
    private voucherService: VoucherService,
    private cdr: ChangeDetectorRef,
    private voucherComponent: VoucherComponent
  ) { }

  ngOnInit(): void {
  }

  agInit(params: any) {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  openUpdate(id: number): void {
    const dialogref = this.matdialog.open(EditVoucherComponent, {
      width: '250vh',
      height: '98vh',
      data: { idVoucher: id },
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'saveVoucher') {
        this.voucherComponent.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  clickDetail(id: number): void {
    const dialogref = this.matdialog.open(DetailVoucherComponent, {
      width: '60%',
      height: '85%',
      data: { idVoucher: id },
    });
    dialogref.afterClosed().subscribe(() => {
      this.voucherComponent.ngOnInit();
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
        this.voucherService.deleteVoucher(id).subscribe(() => {
          this.voucherComponent.ngOnInit();
          this.cdr.detectChanges();
        });
        Swal.fire('Xóa', 'Xóa thành công', 'success');
      }
    })
  }
}
