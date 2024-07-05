import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { SalesCouterVoucherService } from '../../../service/sales-couter-voucher.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../util/util.service';

@Component({
  selector: 'app-pogup-voucher-sc',
  templateUrl: './pogup-voucher-sc.component.html',
  styleUrls: ['./pogup-voucher-sc.component.css']
})

export class PogupVoucherSCComponent implements OnInit {
  listVoucher: any = [];

  listVoucherShip: any = [];

  voucherChoice: any = {
    voucher: null,
    voucherShip: null
  };

  codeSearch: any;
  idCustomer = null;

  checkConditionApply: boolean = false;

  checkStartDate: boolean = false;

  constructor(
    private voucherService: SalesCouterVoucherService,
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
  }

  getVoucherSales() {
    const obj = {
      code: this.codeSearch !== undefined && this.codeSearch !== null ? this.codeSearch : '',
      idCustomerLogin: this.idCustomer !== null ? this.idCustomer : null
    };
    console.log(obj)

    this.voucherService.getAllVoucherSales(obj).subscribe(res => {
      console.log(res)
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
    this.checkStartDate = false;
    if (new Date(v.startDate) > new Date()) {
      this.checkStartDate = true;
      return true;
    } else if (v.conditionApply > this.data.total) {
      this.checkConditionApply = true;
      return true;
    } else {
      this.checkStartDate = false;
      this.checkConditionApply = false;
      return false;
    }
  }
}
