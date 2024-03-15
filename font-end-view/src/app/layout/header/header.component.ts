import {Component, OnInit} from '@angular/core';
import {apiURL} from '../../config/apiURL';
import {UsersDTO} from '../../component/model/UsersDTO';
import {BehaviorSubject} from 'rxjs';
import {CartService} from '../../service/cart.service';
import {Router} from '@angular/router';
import {AuthJwtService} from '../../service/authentication/auth-jwt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  infoCustomer: UsersDTO;
  size: number;
  totalProducts: number = 0;
  isLoggedIn: boolean = false;
  constructor(private cartService: CartService, private router: Router, private istoken: AuthJwtService) {
    this.cartService.totalProducts$.subscribe((totalProducts) => {
      this.totalProducts = totalProducts;
    });
  }

  api = apiURL;

  updateInFor(infor: UsersDTO){

  }

  exLogin() {
    if (this.istoken.isAuthenticated() === true){
      this.isLoggedIn = true;
    }else {
      this.isLoggedIn = false;
    }
  }

  ngOnInit(): void {
    this.infoCustomer = JSON.parse(localStorage.getItem('users'));
    this.size = localStorage.getItem('users').length;
    this.istoken.isAuthenticated();
    this.exLogin();
  }
  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('users');
    localStorage.removeItem('customer');
    this.isLoggedIn = false;
  }
}
