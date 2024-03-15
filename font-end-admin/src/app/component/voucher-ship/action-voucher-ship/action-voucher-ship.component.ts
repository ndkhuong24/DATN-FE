import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {VoucherService} from "../../../service/voucher.service";
import {ICellRendererParams} from "ag-grid-community";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {VoucherShipService} from "../../../service/voucher-ship.service";

@Component({
  selector: 'app-action-voucher-ship',
  templateUrl:  './action-voucher-ship.component.html',
  styleUrls: ['./action-voucher-ship.component.css']
})
export class ActionVoucherShipComponent implements OnInit, ICellRendererAngularComp {
  isMenuOpen: boolean = false;
  data: any;
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private voucherService: VoucherShipService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    console.log(this.data.id);
  }
  agInit(params): void {
    this.data = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  editItem(): void {
    console.log(this.data);
    this.router.navigate(['/admin/edit-voucherFS', this.data.id]);
  }

  delete(): void {
    Swal.fire({
      title: 'Bạn có muốn xóa voucher freeship không?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voucherService.deleteVoucher(this.data.id).subscribe((response) => {
            this.router.navigateByUrl('/admin/voucherFS');
          },
          error => {
            this.toastr.error('Xóa voucher freeship thất bại');
          });
        location.reload();
      }
      Swal.fire({
        title: 'Xóa voucher freeship thành công!',
        icon: 'success'
      });
    });
  }
  detail(): void {
    this.router.navigate(['/admin/voucherFS', this.data.id]);
  }
}

