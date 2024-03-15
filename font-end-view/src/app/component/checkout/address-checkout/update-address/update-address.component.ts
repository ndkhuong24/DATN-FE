import {Component, Inject, OnInit} from '@angular/core';
import {GiaoHangService} from '../../../../service/giao-hang.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AddressService} from '../../../../service/address.service';

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

  constructor(private giaoHangService: GiaoHangService, public matRef: MatDialogRef<UpdateAddressComponent>,
              private addressService: AddressService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    if (this.data.title === 'update') {
      this.addressService.detailAddress(this.data.address).subscribe(res => {
        if (res.status === 'OK') {
          this.address = res.data;
          this.getDistrict(this.address.provinceId);
          this.getWard(this.address.districtId);
        }
      });
    }
    console.log(this.address);
    this.giaoHangService.getAllProvince().subscribe(res => {
      this.listProvince = res.data;
    });
  }

  getDistrict(provinceID: any) {
    // console.log(event);
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
    console.log(this.address);
    let province = this.listProvince.find(c => c.ProvinceID === this.address.provinceId);
    console.log(province);
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
      console.log(res.data);
      this.matRef.close('saveAddress');
    });
  }
}
