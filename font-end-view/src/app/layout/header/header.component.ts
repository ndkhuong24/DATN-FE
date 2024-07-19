import { Component, OnInit } from '@angular/core';
import { UsersDTO } from '../../component/model/UsersDTO';
import { CartService } from '../../service/cart.service';
import { AuthJwtService } from '../../service/authentication/auth-jwt.service';

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

  constructor(
    private cartService: CartService,
    private istoken: AuthJwtService
  ) {
    this.cartService.totalProducts$.subscribe((totalProducts) => {
      this.totalProducts = totalProducts;
    });
  }

  exLogin() {
    if (this.istoken.isAuthenticated() === true) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  ngOnInit(): void {
    this.infoCustomer = JSON.parse(localStorage.getItem('customer'));
    // console.log(this.infoCustomer.id)
    this.size = localStorage.getItem('customer').length;
    this.istoken.isAuthenticated();
    this.exLogin();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    this.isLoggedIn = false;
  }
}
