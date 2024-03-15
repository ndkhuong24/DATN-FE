import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthJwtService} from './auth-jwt.service';
import jwtDecode from 'jwt-decode';
import {ToastrService} from 'ngx-toastr';
import {UsersDTO} from '../component/model/UsersDTO';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthJwtService, public router: Router, private toastr: ToastrService) {
  }
  roles: string;
  users: UsersDTO = {};
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    const usersRole = localStorage.getItem('users');
    this.users = JSON.parse(usersRole);
    this.roles = this.users.role;
    console.log(this.roles);
    console.log(expectedRole);
    if (!this.auth.isAuthenticated() || expectedRole.toString() !== this.roles ) {
      this.toastr.error('Bạn không có quyền truy cập', 'Lỗi');
      return false;
    }
    return true;
  }
}
