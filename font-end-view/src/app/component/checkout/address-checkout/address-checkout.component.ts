import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UpdateAddressComponent} from './update-address/update-address.component';
import {AddressService} from '../../../service/address.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-address-checkout',
  templateUrl: './address-checkout.component.html',
  styleUrls: ['./address-checkout.component.css']
})
export class AddressCheckoutComponent implements OnInit {

  listAddress: any = [];
  idAddress: any;

  constructor(private dialog: MatDialog, private addressService: AddressService, private cdr: ChangeDetectorRef,
              public matDialogRef: MatDialogRef<AddressCheckoutComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    const obj = {
      idCustomer: this.data
    };
    this.addressService.getAllAddress(obj).subscribe(res => {
      this.listAddress = res;
    });
    this.addressService.getAddress(obj).subscribe(res => {
      this.idAddress = res.data.id;
    });
  }

  openPopup() {
    this.dialog.open(UpdateAddressComponent, {
      width: '40%',
      height: '65vh',
      data: {
        title: 'save',
        customer: this.data,
        address: this.idAddress
      }
    }).afterClosed().subscribe(result => {
      if (result === 'saveAddress') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  openPopupUpdate() {
    this.dialog.open(UpdateAddressComponent, {
      width: '40%',
      height: '65vh',
      data: {
        title: 'update',
        customer: this.data,
        address: this.idAddress
      }
    }).afterClosed().subscribe(result => {
      if (result === 'saveAddress') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });;
  }

  xacNhan() {
    const obj = {
      id: this.idAddress,
      idCustomer: this.data
    };
    this.addressService.updateAddressConfig(obj).subscribe(res => {
      if (res.status === 'OK') {
        this.toastr.success('Thay đổi địa chỉ thành công!', 'Thông báo');
        this.matDialogRef.close('close-address');
      }
    });
  }

  closePopup() {
    this.matDialogRef.close('');
  }
}
