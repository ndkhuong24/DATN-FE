import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import {TokenService} from '../../service/token.service';
import {SignForm} from '../model/SignForm';
import {AuthJwtService} from '../../service/auth-jwt.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  status = 'Dang nhap that bai';
  form: any = {
    username: '',
    password: ''
  };
  signFrom: SignForm;
  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService, private jwt: AuthJwtService, private toas: ToastrService) { }
  login() {
    this.signFrom = new SignForm(
      this.form.username,
      this.form.password
    );
    console.log(this.signFrom);
    this.authService.signIn(this.signFrom).subscribe(data =>{
      if (!data.token){
        alert('Lỗi đăng nhập');
      }else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('users', JSON.stringify(data.usersDTO));
        localStorage.setItem('fullname', data.usersDTO.fullname);
        localStorage.setItem('id', JSON.stringify(data.usersDTO.id));
        this.router.navigate(['']);
      }
    }, error => {
        this.toas.error('thông tin tài khoản hoặc mật khẩu không chính xác', 'Lỗi');
      }
    );
  }
  ngOnInit(): void {
  }

}
