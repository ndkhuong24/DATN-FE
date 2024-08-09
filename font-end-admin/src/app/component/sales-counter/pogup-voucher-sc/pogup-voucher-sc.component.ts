import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { SalesCouterVoucherService } from '../../../service/sales-couter-voucher.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../util/util.service';
import { VoucherService } from 'src/app/service/voucher.service';

@Component({
  selector: 'app-pogup-voucher-sc',
  templateUrl: './pogup-voucher-sc.component.html',
  styleUrls: ['./pogup-voucher-sc.component.css']
})

export class PogupVoucherSCComponent implements OnInit {
  listVoucher: any = [];
  listVoucherCurrent: any = [];

  listVoucherShip: any = [];

  voucherChoice: any = {
    voucher: null,
    voucherShip: null
  };

  codeSearch: any;
  idCustomer = null;

  checkConditionApply: boolean = false;
  checkQuanity: boolean = false;
  checkStartDate: boolean = false;

  constructor(
    private voucherService: SalesCouterVoucherService,
    private voucherServicee: VoucherService,
    public matDialogRef: MatDialogRef<PogupVoucherSCComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    public utilService: UtilService
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.customer && this.data.customer.id !== undefined) {
      this.idCustomer = this.data.customer.id;
    } else {
      this.idCustomer = null;
    }

    this.getVoucherSales();
  }

  getVoucherSales() {
    const obj = {
      code: this.codeSearch !== undefined && this.codeSearch !== null ? this.codeSearch : '',
      idCustomerLogin: this.idCustomer !== null ? this.idCustomer : null
    };

    this.voucherService.getAllVoucherSales(obj).subscribe(res => {
      this.listVoucher = res;
    });

    this.cdr.detectChanges();
  }

  xacNhan() {
    this.toastr.success('Áp dụng Voucher thành công', 'Thông báo');
    this.matDialogRef.close({ event: 'saveVoucher', data: this.voucherChoice });
  }

  closePopup() {
    this.matDialogRef.close('close-voucher');
  }

  searchVoucher() {
    this.getVoucherSales();
    this.cdr.detectChanges();
  }

  checkValidateVoucher(v: any) {
    this.checkConditionApply = false;
    this.checkQuanity = false;
    this.checkStartDate = false;

    if (new Date(v.startDate) > new Date()) {
      this.checkStartDate = true;
      return true;
    } else if (v.conditionApply > this.data.total) {
      this.checkConditionApply = true;
      return true;
    } else if (v.useVoucher >= v.quantity && v.quantity > 0) {
      // Adjusted condition to check if useVoucher is greater than or equal to quantity
      this.checkQuanity = true;
      return true;
    } else {
      this.checkStartDate = false;
      this.checkQuanity = false;
      this.checkConditionApply = false;
      return false;
    }
  }
}
