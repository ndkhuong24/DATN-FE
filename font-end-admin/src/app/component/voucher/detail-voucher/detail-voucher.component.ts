import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VoucherService} from "../../../service/voucher.service";
import {UtilService} from "../../../util/util.service";

@Component({
  selector: 'app-detail-voucher',
  templateUrl: './detail-voucher.component.html',
  styleUrls: ['./detail-voucher.component.css']
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
    createName: localStorage.getItem('fullname'),
  };
  constructor(private  activatedRoute: ActivatedRoute,
              private voucherService: VoucherService,
              public util: UtilService) { }

  ngOnInit(): void {
    // Lấy thông tin khuyến mãi dựa trên id từ tham số URL
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      console.log(id);
      this.voucherService.getDetailVoucher(id).subscribe((response: any[]) => {
        const firstElement = Array.isArray(response) ? response[0] : response;
        console.log(firstElement);
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
        console.log(this.voucher);
      });
    });
  }
  getVoucherTypeText(): string{
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
  getAllow(): string{
    if (this.voucher.allow === 0) {
      return 'Không cho phép';
    } else if (this.voucher.allow === 1) {
      return 'Cho phép';
    } else {
      return 'Không rõ';
    }
  }
}
