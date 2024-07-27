import { Component, OnInit } from '@angular/core';
import { SignInFrom } from '../model/SignInFrom';
import { Router } from '@angular/router';
import { SignInService } from '../../service/authentication/sign-in.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(
    private signIn: SignInService,
    private router: Router,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) { }

  login() {
    this.signFrom = new SignInFrom(
      this.form.username,
      this.form.password
    );

    this.signIn.signIn(this.signFrom).subscribe(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('customer', JSON.stringify(data.usersDTO));

      this.router.navigate(['/home']).then(() => {
        
        location.reload();
        this.toastr.success('Đăng nhập thành công', 'Thông báo');
      });
    },
      error => {
        if (error.status === 400) {
          this.toastr.error('Mật khẩu sai ', 'Error');
        } else if (error.status === 401) {
          this.toastr.error('Không tìm thấy Tên tài khoản ', 'Error');
        }
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.cookieService.delete('cart');
  }
}
