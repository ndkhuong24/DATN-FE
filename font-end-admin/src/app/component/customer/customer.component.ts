import { Component, OnInit } from '@angular/core';
import {UsersDTO} from '../model/UsersDTO';
import {CustomerServiceService} from '../../service/customer-service.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CommonFunction} from '../../util/common-function';
import {ValidateInput} from '../model/validate-input';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer: any = {
    fullname: '',
    birthday: '',
    phone: '',
    gender: 'Nam'
  };
  validReceiver: ValidateInput = new ValidateInput();
  validEmail: ValidateInput = new ValidateInput();
  validReceiverPhone: ValidateInput = new ValidateInput();
  constructor(private customerService: CustomerServiceService ,private dialogRef: MatDialogRef<CustomerComponent>, private toastr: ToastrService) { }
  addCustomerSC(){
    this.customer.fullname = CommonFunction.trimText(this.customer.fullname);
    this.customer.phone = CommonFunction.trimText(this.customer.phone);
    this.validateReceiver();
    this.validateReceiverPhone();
    if (!this.validReceiver.done || !this.validReceiverPhone.done){
      return;
    }
    this.customerService.addCustomerSC(this.customer).subscribe(data => {
      if (data.message === 'The phone is existed'){
        this.toastr.error('Số điện thoại đã tồn tại');
        return;
      }
      console.log(data);
      this.toastr.success('Thêm thành công', 'Thông báo');
      this.closeDialog();
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateReceiver() {
    this.validReceiver = CommonFunction.validateInput(this.customer.fullname, 250, null);
  }

  validateReceiverPhone() {
    this.validReceiverPhone = CommonFunction.validateInput(this.customer.phone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }
}
