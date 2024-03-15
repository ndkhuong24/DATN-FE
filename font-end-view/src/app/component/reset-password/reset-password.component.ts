import { Component, OnInit } from '@angular/core';
import {UsersDTO} from '../model/UsersDTO';
import {CustomerInforService} from '../../service/customer-infor.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ValidateInput} from '../../model/validate-input.model';
import {CommonFunction} from '../../util/common-function';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  infoCusotmer: UsersDTO = new UsersDTO();
  validReceiverPassword: ValidateInput = new ValidateInput();
  validReceivernewPassword: ValidateInput = new ValidateInput();
  validConfirm: boolean = true;
  rePass: string;
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;
  constructor(private service: CustomerInforService, private toasv: ToastrService, private router: Router) { }
  resetPass(){
    this.infoCusotmer.newPass = CommonFunction.trimText(this.infoCusotmer.newPass);
    this.rePass = CommonFunction.trimText(this.rePass);
    const newPass: UsersDTO = {
      email: localStorage.getItem('emailForgot'),
      newPass: this.infoCusotmer.newPass
    };
    this.service.resetPass(newPass).subscribe(data => {
      console.log(data);
      this.toasv.success('Mật khẩu đã được đặt lại, Mời bạn đăng nhập ', 'Success');
      this.router.navigate(['/login']);
    });
  }
  ngOnInit(): void {
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibilitConfirm(): void {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateReceiverPassword(){
    this.validReceiverPassword = CommonFunction.validateInput(this.infoCusotmer.password, 50, null);
  }
  validateReceivernewPassword(){
    this.validReceivernewPassword = CommonFunction.validateInput(this.infoCusotmer.newPass, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  }
  validateConfirmPass(){
    this.validConfirm = this.infoCusotmer.newPass === this.rePass;
  }
}
