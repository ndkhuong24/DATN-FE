import { Component, Inject, OnInit } from '@angular/core';
import { VoucherShipService } from '../../../service/voucher-ship.service';
import { UtilService } from '../../../util/util.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-voucher-ship',
  templateUrl: './detail-voucher-ship.component.html',
  styleUrls: ['./detail-voucher-ship.component.css'],
})
export class DetailVoucherShipComponent implements OnInit {
  voucherShip: any = {
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    reducedValue: '',
    conditionApply: '',
    quantity: '',
    createDate: '',
    customerAdminDTOList: '',
    limitCustomer: '',
    optionCustomer: '',
    createName: '',
  };

  idVoucherShip: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private voucherShipService: VoucherShipService,
    public util: UtilService
  ) {
    this.idVoucherShip = data.idVoucherShip;
  }

  ngOnInit(): void {
    this.fillVoucherFreeShip(this.idVoucherShip);
  }

  fillVoucherFreeShip(idVoucherShip: number) {
    this.voucherShipService
      .getDetailVoucher(idVoucherShip)
      .subscribe((response: any[]) => {
        const firstElement = Array.isArray(response) ? response[0] : response;

        this.voucherShip.id = firstElement.id;
        this.voucherShip.name = firstElement.name;
        this.voucherShip.description = firstElement.description;
        this.voucherShip.startDate = firstElement.startDate;
        this.voucherShip.endDate = firstElement.endDate;
        this.voucherShip.conditionApply = firstElement.conditionApply;
        this.voucherShip.reducedValue = firstElement.reducedValue;
        this.voucherShip.quantity = firstElement.quantity;
        this.voucherShip.createDate = firstElement.createDate;
        this.voucherShip.limitCustomer = firstElement.limitCustomer;
        this.voucherShip.customerAdminDTOList =
          firstElement.customerAdminDTOList;
        this.voucherShip.createName = firstElement.createName;
      });
  }
}
