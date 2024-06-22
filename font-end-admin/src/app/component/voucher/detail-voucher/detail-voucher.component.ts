import { Component, Inject, OnInit } from '@angular/core';
import { VoucherService } from '../../../service/voucher.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilService } from 'src/app/util/util.service';

@Component({
  selector: 'app-detail-voucher',
  templateUrl: './detail-voucher.component.html',
  styleUrls: ['./detail-voucher.component.css'],
})
export class DetailVoucherComponent implements OnInit {
  voucher: any = {
    name: '',
    startDate: '',
    endDate: '',
    createDate: '',
    description: '',
    reducedValue: '',
    maxReduced: 0,
    voucherType: '',
    conditionApply: '',
    quantity: '',
    customerAdminDTOList: '',
    limitCustomer: '',
    allow: '',
    apply: '',
    optionCustomer: '',
    createName: '',
  };

  idVoucher: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private voucherService: VoucherService,
    public util: UtilService,
  ) {
    this.idVoucher = data.idVoucher;
  }

  ngOnInit(): void {
    this.fillVoucher(this.idVoucher);
  }

  fillVoucher(idVoucher: number) {
    this.voucherService
      .getDetailVoucher(idVoucher)
      .subscribe((response: any[]) => {
        const firstElement = Array.isArray(response) ? response[0] : response;
        this.voucher.id = firstElement.id;
        this.voucher.name = firstElement.name;
        this.voucher.description = firstElement.description;
        this.voucher.conditionApply = firstElement.conditionApply;
        this.voucher.voucherType = firstElement.voucherType;
        this.voucher.endDate = firstElement.endDate;
        this.voucher.quantity = firstElement.quantity;
        this.voucher.reducedValue = firstElement.reducedValue;
        this.voucher.maxReduced = firstElement.maxReduced;
        this.voucher.startDate = firstElement.startDate;
        this.voucher.allow = firstElement.allow;
        this.voucher.apply = firstElement.apply;
        this.voucher.createDate = firstElement.createDate;
        this.voucher.limitCustomer = firstElement.limitCustomer;
        this.voucher.customerAdminDTOList = firstElement.customerAdminDTOList;
        this.voucher.createName = firstElement.createName;
      });
  }

  getVoucherTypeText(): string {
    if (this.voucher.voucherType === 1) {
      return 'Theo %';
    } else if (this.voucher.voucherType === 0) {
      return 'Theo tiền';
    } else {
      return 'Không rõ';
    }
  }

  getApplyText(): string {
    if (this.voucher.apply === 0) {
      return 'Tại cửa hàng';
    } else if (this.voucher.apply === 1) {
      return 'Mua online';
    } else {
      return 'Tất cả mọi nơi';
    }
  }

  getAllow(): string {
    if (this.voucher.allow === 0) {
      return 'Không cho phép';
    } else if (this.voucher.allow === 1) {
      return 'Cho phép';
    } else {
      return 'Không rõ';
    }
  }
}
