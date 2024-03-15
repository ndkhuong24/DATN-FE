import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthJwtService} from './auth-jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthJwtService, public router: Router) {}
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('users');
      this.router.navigate(['admin/login']);
      return false;
    }
  }
}
