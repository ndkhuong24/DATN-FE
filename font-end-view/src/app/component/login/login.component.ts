import { Component, OnInit } from '@angular/core';
import {SignInFrom} from '../model/SignInFrom';
import {AuthService} from '../../service/authentication/auth.service';
import {Router} from '@angular/router';
import {AuthJwtService} from '../../service/authentication/auth-jwt.service';
import {SignInService} from '../../service/authentication/sign-in.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  hide = true;
  form: any = {
    username: '',
    password: ''
  };
  signFrom: SignInFrom;
  constructor(private signIn: SignInService, private router: Router, private jwt: AuthJwtService, private toastr: ToastrService) { }
  login() {
    this.signFrom = new SignInFrom(
      this.form.username,
      this.form.password
    );
    console.log(this.signFrom);
    this.signIn.signIn(this.signFrom).subscribe(data => {
        localStorage.setItem('token', data.token);
        console.log(data.usersDTO);
        localStorage.setItem('users', JSON.stringify(data.usersDTO));
        localStorage.setItem('customer', JSON.stringify(data.usersDTO));
        this.router.navigate(['']).then(() => {
          location.reload();
          this.toastr.success('Đăng nhập thành công', 'Thông báo');
        });
    },
      error => {
        if (error.status === 400){
          this.toastr.error('Mật khẩu sai ', 'Error');
        }else if (error.status === 401){
          this.toastr.error('Không tìm thấy Tên tài khoản ', 'Error');
        }
      }
    );
  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  ngOnInit(): void {
  }

}
