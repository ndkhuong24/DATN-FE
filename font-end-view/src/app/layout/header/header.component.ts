import { Component, OnInit } from '@angular/core';
import { UsersDTO } from '../../component/model/UsersDTO';
import { CartService } from '../../service/cart.service';
import { AuthJwtService } from '../../service/authentication/auth-jwt.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

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
  cartData = new Map();

  constructor(
    private cartService: CartService,
    private istoken: AuthJwtService,
    private cookieService: CookieService,
  ) {
    this.cartService.totalProducts$.subscribe((totalProducts) => {
      this.totalProducts = totalProducts;
    });

    if (this.cookieService.check('cart')) {
      const cartData = this.cookieService.get('cart');
      const entries = JSON.parse(cartData);
      this.cartData = new Map(entries);
      this.cartService.updateTotalProducts(this.cartData.size);
    }
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
    this.size = localStorage.getItem('customer').length;
    this.istoken.isAuthenticated();

    this.exLogin();

    if (this.infoCustomer) {
      this.cartService.getCartCustomer(this.infoCustomer.id).subscribe((res) => {
        if (res && res.success) {
          if (Array.isArray(res.data)) {
            res.data.forEach(item => {
              if (item && item.quantity !== undefined) {
                this.updateCookieWithServerCart(item);
              } 
              // else {
              //   this.showErrorNotification('Dữ liệu không hợp lệ.');
              // }
            });
          } 
          // else {
          //   this.showErrorNotification('Dữ liệu trả về không hợp lệ.');
          // }
        } 
        // else {
        //   this.showErrorNotification(res.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng.');
        // }
      })
    }
  }

  updateCookieWithServerCart(data: any) {
    const productKey = data.idProduct + '-' + data.idColor + '-' + data.idSize;

    this.cartData.set(productKey, data.quantity);

    this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())));

    this.cartService.updateTotalProducts(this.cartData.size);
  }

  showSuccessNotification(message: string) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  showErrorNotification(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Có lỗi xảy ra',
      text: message,
    });
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    this.cookieService.delete('cart');
    this.isLoggedIn = false;
  }
}
