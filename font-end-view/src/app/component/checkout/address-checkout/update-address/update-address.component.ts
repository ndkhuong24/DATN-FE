import { Component, Inject, OnInit } from '@angular/core';
import { GiaoHangService } from '../../../../service/giao-hang.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddressService } from '../../../../service/address.service';
import { ValidateInput } from 'src/app/model/validate-input.model';
import { CommonFunction } from 'src/app/util/common-function';

@Component({
  selector: 'app-update-address',
  templateUrl: './update-address.component.html',
  styleUrls: ['./update-address.component.css']
})

export class UpdateAddressComponent implements OnInit {
  listProvince = [];
  listDistrict = [];
  listWard = [];

  address: any = {
    id: null,
    provinceId: null,
    districtId: null,
    wardCode: null,
    specificAddress: null,
    config: null
  };

  showButtonAdd: boolean = false;
  showButtonUpdate: boolean = false;

  validProvince: ValidateInput = new ValidateInput();
  validDiaChi: ValidateInput = new ValidateInput();
  validDistrict: ValidateInput = new ValidateInput();
  validWard: ValidateInput = new ValidateInput();

  constructor(
    private giaoHangService: GiaoHangService,
    public matRef: MatDialogRef<UpdateAddressComponent>,
    private addressService: AddressService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    if (this.data.title === 'update') {
      this.showButtonUpdate = true;
      this.showButtonAdd = false;
    } else if (this.data.title === 'save') {
      this.showButtonUpdate = false;
      this.showButtonAdd = true;
    }

    if (this.data.title === 'update') {
      this.addressService.detailAddress(this.data.address).subscribe(res => {
        if (res.status === 'OK') {
          this.address = res.data;
          this.getDistrict(this.address.provinceId);
          this.getWard(this.address.districtId);
        }
      });
    }

    this.giaoHangService.getAllProvince().subscribe(res => {
      this.listProvince = res.data;
    });
  }

  getDistrict(provinceID: any) {
    this.giaoHangService.getAllDistrictByProvince(provinceID).subscribe(res => {
      this.listDistrict = res.data;
    });
  }

  getWard(DistrictID: any) {
    this.giaoHangService.getAllWardByDistrict(DistrictID).subscribe(res => {
      this.listWard = res.data;
    });
  }

  add() {
    this.validateProvince();
    this.validateDistrict();
    this.validateWard();
    this.validateDiaChi();

    if (!this.validProvince.done || !this.validDistrict.done || !this.validWard.done || !this.validDiaChi.done) {
      return;
    }

    let province = this.listProvince.find(c => c.ProvinceID === this.address.provinceId);
    let district = this.listDistrict.find(d => d.DistrictID === this.address.districtId);
    let ward = this.listWard.find(w => w.WardCode === this.address.wardCode);

    const obj = {
      ...this.address,
      specificAddress: (this.address.specificAddress === null || this.address.specificAddress === '') ? '...' : this.address.specificAddress,
      idCustomer: this.data.customer,
      provinceId: parseInt(this.address.provinceId, 10),
      province: province.ProvinceName,
      district: district.DistrictName,
      wards: ward.WardName
    };

    this.addressService.createAddress(obj).subscribe(res => {
      this.matRef.close('saveAddress');
    });
  }

  revoveInvalid(result: { done: boolean; }) {
    result.done = true;
  }

  validateProvince() {
    this.validProvince = CommonFunction.validateInput(this.address.provinceId, null, null);
  }

  validateDiaChi() {
    this.validDiaChi = CommonFunction.validateInput(this.address.specificAddress, null, null);
  }

  validateDistrict() {
    this.validDistrict = CommonFunction.validateInput(this.address.districtId, null, null);
  }

  validateWard() {
    this.validWard = CommonFunction.validateInput(this.address.wardCode, null, null);
  }
}
