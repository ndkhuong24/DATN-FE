import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthJwtService {
  constructor(public jwtHelper: JwtHelperService, private toastr: ToastrService, private router: Router) { }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('users');
      this.router.navigate(['/login']);
      this.toastr.error('Phiên đăng nhập đã hết hạn', 'Thông báo:');
      return false;
    }
    return true;
  }
}
