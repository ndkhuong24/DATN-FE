import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {VoucherService} from '../../../service/voucher.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {VoucherShipService} from '../../../service/voucher-ship.service';
import {UtilService} from '../../../util/util.service';

@Component({
  selector: 'app-popup-voucher',
  templateUrl: './popup-voucher.component.html',
  styleUrls: ['./popup-voucher.component.css']
})
export class PopupVoucherComponent implements OnInit {

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



  constructor(private voucherService: VoucherService, public matDialogRef: MatDialogRef<PopupVoucherComponent>,
              private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef,
              private voucherShipService: VoucherShipService, public utilService: UtilService) {
    const storedUserString = localStorage.getItem('customer');

    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      this.idCustomer = storedUser.id;
    }
    this.voucherChoice = this.data.voucherChoice;
  }

  ngOnInit(): void {
    this.getVoucher();
    this.getVoucherShip();
  }

  getVoucher() {
    const obj = {
      code: this.codeSearch !== undefined && this.codeSearch !== null ? this.codeSearch : '',
      idCustomerLogin: this.idCustomer !== null ? this.idCustomer : null
    };
    this.voucherService.getAllVoucher(obj).subscribe(res => {
      this.listVoucher = res;
      console.log('data: ', res);
    });
    this.cdr.detectChanges();
  }
  getVoucherShip() {
    const obj = {
      code: this.codeSearch !== undefined && this.codeSearch !== null ? this.codeSearch : '',
      idCustomerLogin: this.idCustomer !== null ? this.idCustomer : null
    };
    this.voucherShipService.getAllVoucherShip(obj).subscribe(res => {
      this.listVoucherShip = res;
      console.log('data: ', res);
    });
    this.cdr.detectChanges();
  }

  xacNhan() {
    console.log(this.voucherChoice);
    this.toastr.success('Áp dụng Voucher thành công', 'Thông báo');
    this.matDialogRef.close({event: 'saveVoucher', data: this.voucherChoice});
  }

  closePopup() {
    this.matDialogRef.close('close-voucher');
  }

  searchVoucher() {
    this.getVoucher();
    this.cdr.detectChanges();
  }

  checkValidateVoucher(v: any) {
    this.checkConditionApply = false;
    this.checkStartDate = false;
    if (new Date(v.startDate) > new Date()) {
      this.checkStartDate = true;
      return true;
    }else if (v.conditionApply > this.data.total) {
      this.checkConditionApply = true;
      return true;
    } else {
      this.checkStartDate = false;
      this.checkConditionApply = false;
      return false;
    }
  }
}
