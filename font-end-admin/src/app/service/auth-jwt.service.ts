import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TokenService} from './token.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthJwtService {

  constructor(public jwtHelper: JwtHelperService, private router: Router) { }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('users');
      localStorage.removeItem('listOrder');
      this.router.navigate(['/admin/login']);
      return false;
    }
    return true;
  }
}
