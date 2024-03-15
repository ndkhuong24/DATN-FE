import { Component, OnInit } from '@angular/core';
import {UsersDTO} from '../model/UsersDTO';
import {CustomerInforService} from '../../service/customer-infor.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ValidateInput} from '../../model/validate-input.model';
import {CommonFunction} from '../../util/common-function';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent implements OnInit {
  infoCustomer: UsersDTO;
  rePass: string;
  validReceiver: ValidateInput = new ValidateInput();
  validEmail: ValidateInput = new ValidateInput();
  validReceiverPhone: ValidateInput = new ValidateInput();
  validReceiverPassword: ValidateInput = new ValidateInput();
  validReceivernewPassword: ValidateInput = new ValidateInput();
  validConfirm: boolean = true;
  constructor(private customerInforService: CustomerInforService, private toastr: ToastrService,private router: Router) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }
  private loadUserInfo(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.infoCustomer = JSON.parse(storedUsers);
      this.formatBirthday();
    }
  }

  private formatBirthday(): void {
    if (this.infoCustomer && this.infoCustomer.birthday) {
      const dateObject = new Date(this.infoCustomer.birthday);
      const formattedDate = this.formatDate(dateObject);
      this.infoCustomer.birthday = formattedDate;
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  updateInfor(){
    this.infoCustomer.fullname = CommonFunction.trimText(this.infoCustomer.fullname);
    this.infoCustomer.phone = CommonFunction.trimText(this.infoCustomer.phone);
    this.infoCustomer.username = CommonFunction.trimText(this.infoCustomer.username);
    this.validateReceiver();
    this.validateEmail();
    this.validateReceiverPhone();
    if (!this.validReceiver.done || !this.validEmail.done || !this.validReceiverPhone.done){
      return;
    }
    this.customerInforService.updateInfor(this.infoCustomer).subscribe(
      data => {
        if (data.message === 'Phone existed'){
          this.toastr.error('Số điện thoại đã tồn tại');
          return;
        }
        if (data.message === 'Email existed'){
          this.toastr.error('Email đã tồn tại');
          return;
        }
        console.log(data);
        console.log(this.infoCustomer);
        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(this.infoCustomer));
        this.loadUserInfo();
        const toastrRef = this.toastr.success('Cập nhật thành công!', 'Success', { timeOut: 1000});
        setTimeout(() => {
          this.handleReload();
        }, 1000);
      },
      error => {
        console.error(error);
        this.toastr.error('Đã xảy ra lỗi khi cập nhật thông tin!', 'Error');
      }
    );
  }
  handleReload() {
    this.router.navigate(['/user-profile']).then(() => {
      location.reload();
    });
  }
  changePass(){
    this.infoCustomer.password = CommonFunction.trimText(this.infoCustomer.password);
    this.infoCustomer.newPass = CommonFunction.trimText(this.infoCustomer.newPass);
    this.validateReceiverPassword();
    this.validateReceivernewPassword();
    this.validateConfirmPass();
    if (!this.validReceiverPassword.done || !this.validReceivernewPassword.done){
      return;
    }
    this.customerInforService.changePass(this.infoCustomer).subscribe(
      data => {
        console.log(data);
        if (data.status === 'BAD_REQUEST'){
          this.toastr.error('Mật khẩu cũ không chính xác! ', 'Error');
          return;
        }
        this.toastr.success('Cập nhật thành công! ', 'Success');
        this.rePass = '';
        this.infoCustomer.newPass = '';
        this.infoCustomer.password = '';
      },
      error => {
        console.error(error);
        this.toastr.error('Đã xảy ra lỗi khi cập nhật thông tin!', 'Error');
      }
    );
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateReceiver() {
    this.validReceiver = CommonFunction.validateInput(this.infoCustomer.fullname, 250, null);
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.infoCustomer.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
  validateReceiverPhone() {
    this.validReceiverPhone = CommonFunction.validateInput(this.infoCustomer.phone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }
  validateReceiverPassword(){
    this.validReceiverPassword = CommonFunction.validateInput(this.infoCustomer.password, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  }
  validateReceivernewPassword(){
    this.validReceivernewPassword = CommonFunction.validateInput(this.infoCustomer.newPass, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  }
  validateConfirmPass(){
    this.validConfirm = this.infoCustomer.newPass === this.rePass;
  }
}
