import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { SignForm } from '../model/SignForm';
import { AuthJwtService } from '../../service/auth-jwt.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;

  status = 'Đăng nhập thất bại';

  form: any = {
    username: '',
    password: '',
  };

  signFrom: SignForm;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  login() {
    this.signFrom = new SignForm(this.form.username, this.form.password);

    this.authService.signIn(this.signFrom).subscribe(
      (data) => {
        if (!data.token) {
          alert('Lỗi đăng nhập');
        } else if (data.usersDTO.status === 1) {
          // Thông báo khi tài khoản bị đình chỉ
          this.toastr.error('Tài khoản của bạn bị đình chỉ. Vui lòng liên hệ quản lý để mở lại.', 'Thông báo');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('users', JSON.stringify(data.usersDTO));
          localStorage.setItem('fullname', data.usersDTO.fullname);
          localStorage.setItem('id', JSON.stringify(data.usersDTO.id));
          this.router.navigate(['']);
        }
      },
      (error) => {
        if (error.status === 400) {
          this.toastr.error('Mật khẩu sai', 'Error');
        } else if (error.status === 401) {
          this.toastr.error('Không tìm thấy Tên tài khoản', 'Error');
        }
      }
    );
  }

  ngOnInit(): void { }
}
