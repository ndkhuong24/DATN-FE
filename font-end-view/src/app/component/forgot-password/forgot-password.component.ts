import { Component, OnInit } from '@angular/core';
import {UsersDTO} from '../model/UsersDTO';
import {CustomerInforService} from '../../service/customer-infor.service';
import {Router} from '@angular/router';
import {ValidateInput} from '../../model/validate-input.model';
import {CommonFunction} from '../../util/common-function';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  infoCustomer: UsersDTO = new UsersDTO();
  isOTPSent: boolean = false;
  validEmail: ValidateInput = new ValidateInput();
  constructor(private customerIFService: CustomerInforService, private router: Router, private toaxstr: ToastrService) { }
  sendMailOTP(){
    this.validateEmail();
    if (!this.validEmail.done){
      return;
    }
    localStorage.setItem('emailForgot', this.infoCustomer.email);
    const email: UsersDTO = {
      email: this.infoCustomer.email
    };
    this.customerIFService.sendMailOTP(email).subscribe( data => {
      console.log(data);
      this.isOTPSent = true;
    });
  }
  verifyOTP(){
    const otp: UsersDTO = {
      email: this.infoCustomer.email,
      otp: this.infoCustomer.otp
    };
    this.customerIFService.verifyOTP(otp).subscribe(data => {
      console.log(data.status);
      if (data.status === '200'){
        this.router.navigate(['/reset-pass']);
      }
    },
      error => {
        this.toaxstr.error('Mã OTP không chính xác','Error');
      }
    );
  }
  ngOnInit(): void {
  }
  validateEmail(){
    this.validEmail = CommonFunction.validateInput(this.infoCustomer.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
  revoveInvalid(result) {
    result.done = true;
  }
}
