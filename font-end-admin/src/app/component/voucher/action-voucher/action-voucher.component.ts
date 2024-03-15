import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';
import { VoucherService } from 'src/app/service/voucher.service';
import { DetailVoucherComponent } from '../detail-voucher/detail-voucher.component';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: 'app-action-voucher',
  templateUrl: './action-voucher.component.html',
  styleUrls: ['./action-voucher.component.css'],
})
export class ActionVoucherComponent implements OnInit, ICellRendererAngularComp {
  isMenuOpen: boolean = false;
  data: any;
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private voucherService: VoucherService,
    private toastr: ToastrService,
    private  cdr: ChangeDetectorRef
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
    this.router.navigate(['/admin/edit-voucher', this.data.id]);
  }

  detail(): void {
    this.router.navigate(['/admin/voucher', this.data.id]);
  }
  delete(): void {
    Swal.fire({
      title: 'Bạn có muốn xóa voucher không?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voucherService.deleteVoucher(this.data.id).subscribe((response) => {
            this.router.navigateByUrl('/admin/voucher');
          },
          error => {
            this.toastr.error('Xóa voucher thất bại');
          });
        location.reload();
      }
      Swal.fire({
        title: 'Xóa voucher thành công!',
        icon: 'success'
      });
    });
  }
}
