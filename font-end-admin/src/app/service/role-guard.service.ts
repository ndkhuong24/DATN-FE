import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthJwtService } from './auth-jwt.service';
import jwtDecode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { UsersDTO } from '../component/model/UsersDTO';

@Injectable({
  providedIn: 'root'
})

export class RoleGuardService implements CanActivate {
  constructor(
    public auth: AuthJwtService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  role: 'ADMIN' | 'USER' | 'STAFF';

  users: UsersDTO = {};

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;

    var userjson = localStorage.getItem("users");

    var users = JSON.parse(userjson);

    this.role = users.role;

    if (!this.auth.isAuthenticated() || expectedRole.toString() !== this.role) {
      this.toastr.error('Bạn không có quyền truy cập', 'Lỗi');
      return false;
    }
    return true;
  }
}