import { Component, OnInit } from '@angular/core';
import {SignInService} from '../../service/authentication/sign-in.service';
import {Router} from '@angular/router';
import {SignUpRepquest} from '../model/SignUpRepquest';
import {ValidateInput} from '../../model/validate-input.model';
import {CommonFunction} from '../../util/common-function';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  confirmPass = '';
  form: any = {
    fullname: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    birthday: '',
    gender: 'Nam',
    role: ''
  };
  showPassword: boolean = false;
  signUpForm: SignUpRepquest;
  validReceiver: ValidateInput = new ValidateInput();
  validEmail: ValidateInput = new ValidateInput();
  validReceiverPhone: ValidateInput = new ValidateInput();
  validUsername: ValidateInput = new ValidateInput();
  validReceiverPassword: ValidateInput = new ValidateInput();
  validConfirm: boolean = true;
  constructor(private signup: SignInService, private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  signUp() {
    this.form.fullname = CommonFunction.trimText(this.form.fullname);
    this.form.phone = CommonFunction.trimText(this.form.phone);
    this.form.username = CommonFunction.trimText(this.form.username);
    this.validateReceiver();
    this.validateEmail();
    this.validateReceiverPhone();
    this.validateReceiverUsername();
    this.validateReceiverPassword();
    this.validateConfirmPass();
    if (!this.validReceiver.done || !this.validEmail.done || !this.validReceiverPhone.done
      || !this.validUsername.done || !this.validReceiverPassword.done
    ) {
      return;
    }
    this.signUpForm = new SignUpRepquest (
      this.form.fullname,
      this.form.username,
      this.form.password,
      this.form.email,
      this.form.phone,
      this.form.birthday,
      this.form.gender,
      this.form.role,
    );
    console.log(this.signUpForm);
    this.signup.signUp(this.signUpForm).subscribe(data => {
      console.log(data);
      if (data.message === 'Create Success'){
        alert('Đăng kí thành công ! ');
        this.router.navigate(['login']);
      }
        if (data.message === 'The Username is existed'){
          this.toastr.error('Tên tài khoản đã tồn tại', 'Error');
        }else if (data.message === 'The Email is existed'){
          this.toastr.error('Email đã tồn tại', 'Error');
        }else if (data.message === 'The Phone is existed'){
          this.toastr.error('Số điện thoại đã tồn tại', 'Error');
        }
    },
      error => {

      }
    );
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  revoveInvalid(result) {
      result.done = true;
  }

  validateReceiver() {
    this.validReceiver = CommonFunction.validateInput(this.form.fullname, 250, null);
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.form.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
  validateReceiverPhone() {
    this.validReceiverPhone = CommonFunction.validateInput(this.form.phone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }
  validateReceiverUsername(){
    this.validUsername = CommonFunction.validateInputUTF8Space(this.form.username, 50, /^[a-z][a-z\d]*$/, true, true );
  }
  validateReceiverPassword(){
    this.validReceiverPassword = CommonFunction.validateInput(this.form.password, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  }
  validateConfirmPass(){
    this.validConfirm = this.form.password === this.confirmPass;
  }
}
