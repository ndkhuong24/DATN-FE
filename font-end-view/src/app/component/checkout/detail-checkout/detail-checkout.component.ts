import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailService } from '../../../service/order-detail.service';
import { CookieService } from 'ngx-cookie-service';
import { EmailService } from '../../../service/email.service';
import { UtilService } from '../../../util/util.service';
import { CartService } from '../../../service/cart.service';
import { OrderService } from '../../../service/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-detail-checkout',
  templateUrl: './detail-checkout.component.html',
  styleUrls: ['./detail-checkout.component.css']
})
export class DetailCheckoutComponent implements OnInit {
  listCart: any = [];
  cartData1 = new Map();
  cartData2 = new Map();
  order: any;
  orderCurrent: any;
  statusPayment: any;
  email: any;
  user: any = {
    id: null,
    code: null,
    fullname: '',
    phone: '',
    email: '',
  };

  constructor(
    private route: ActivatedRoute,
    private orderDetailService: OrderDetailService,
    private cookieService: CookieService,
    private emailService: EmailService,
    public utilService: UtilService,
    private cartService: CartService,
    private orderService: OrderService,
  ) {
    const local = JSON.parse(localStorage.getItem('order-bill'));
    this.order = local.order;
    this.listCart = local.listCart;
    this.email = this.order.email;
    this.statusPayment = this.route.snapshot.queryParamMap.get('vnp_TransactionStatus');
    this.cartService.updateTotalProducts(0);

    const storedUserString = localStorage.getItem('customer');
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      this.user = {
        id: storedUser.id,
        code: storedUser.code,
        fullname: storedUser.fullname,
        phone: storedUser.phone,
        email: storedUser.email,
      };
    }
  }

  ngOnInit(): void {
    if (this.order.paymentType === 1) {
      if (this.user.id === null) {
        this.orderService.createOrderNotLogin(this.order).subscribe(res => {
          if (res.status === 'OK') {
            this.order.code = res.data.code
            this.orderCurrent = res.data;
            const orderDetailPromises = this.listCart.map((item: { productDetailDTO: { id: any; price: any; }; quantity: any; }) => {
              const obj = {
                idOrder: res.data.id,
                idProductDetail: item.productDetailDTO.id,
                quantity: item.quantity,
                // price: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? (item.productDTO.price - item.productDTO.reducePrice) : item.productDTO.price,
                price: item.productDetailDTO.price,
                // codeDiscount: this.extractCodeDiscount(item.productDTO),
              };
              return this.orderDetailService.createOrderDetail(obj).toPromise();
            });
            forkJoin(orderDetailPromises).subscribe(
              orderDetailsResponses => {
                this.emailService.sendEmailNotLogin(this.orderCurrent).subscribe(result => {
                  localStorage.removeItem('order-bill');
                  // this.cookieService.delete('cart', '/');
                  const cartData1 = this.cookieService.get('checkout');
                  const entries1 = JSON.parse(cartData1);
                  this.cartData1 = new Map(entries1);

                  const cartData2 = this.cookieService.get('cart');
                  const entries = JSON.parse(cartData2);
                  this.cartData2 = new Map(entries);

                  this.cartData1.forEach((value, key) => {
                    const idKey = key.split('-');
                    const cartKey = `${idKey[0]}-${idKey[1]}-${idKey[2]}`;
                    this.cartData2.delete(cartKey);
                    this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData2.entries())));
                  });

                  this.cookieService.delete('checkout', '/');
                });
              },
            );
          }
        });
      }
      else {
        this.orderService.createOrder(this.order).subscribe(res => {
          if (res.status === 'OK') {
            this.order.code = res.data.code
            this.orderCurrent = res.data;
            const orderDetailPromises = this.listCart.map((item: { productDetailDTO: { id: any; price: any; }; quantity: any; }) => {
              const obj = {
                idOrder: res.data.id,
                idProductDetail: item.productDetailDTO.id,
                quantity: item.quantity,
                // price: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? (item.productDTO.price - item.productDTO.reducePrice) : item.productDTO.price,
                price: item.productDetailDTO.price,
                // codeDiscount: this.extractCodeDiscount(item.productDTO),
              };
              return this.orderDetailService.createOrderDetail(obj).toPromise();
            });
            forkJoin(orderDetailPromises).subscribe(
              orderDetailsResponses => {
                this.emailService.sendEmail(this.orderCurrent).subscribe(result => {
                  // localStorage.removeItem('order-bill');
                  // this.cookieService.delete('cart', '/');
                  // this.cookieService.delete('checkout', '/');

                  localStorage.removeItem('order-bill');
                  const cartData1 = this.cookieService.get('checkout');
                  const entries1 = JSON.parse(cartData1);
                  this.cartData1 = new Map(entries1);

                  const cartData2 = this.cookieService.get('cart');
                  const entries = JSON.parse(cartData2);
                  this.cartData2 = new Map(entries);

                  this.cartData1.forEach((value, key) => {
                    const idKey = key.split('-');
                    const cartKey = `${idKey[0]}-${idKey[1]}-${idKey[2]}`;
                    this.cartData2.delete(cartKey);
                    this.cartService.xoa(idKey[0], idKey[1], idKey[2], this.user.id).subscribe((res) => {
                      console.log(res)
                    })
                    this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData2.entries())));
                  });

                  this.cookieService.delete('checkout', '/');
                });
              }
            );
          }
        });
      }
    }

    if (this.order.paymentType === 0) {
      if (this.user.id === null) {
        this.orderService.createOrderNotLogin(this.order).subscribe(res => {
          if (res.status === 'OK') {
            this.order.code = res.data.code
            this.orderCurrent = res.data;
            const orderDetailPromises = this.listCart.map((item: { productDetailDTO: { id: any; price: any; }; quantity: any; }) => {
              const obj = {
                idOrder: res.data.id,
                idProductDetail: item.productDetailDTO.id,
                quantity: item.quantity,
                price: item.productDetailDTO.price,
              };
              return this.orderDetailService.createOrderDetail(obj).toPromise();
            });
            forkJoin(orderDetailPromises).subscribe(
              orderDetailsResponses => {
                this.emailService.sendEmailNotLogin(this.orderCurrent).subscribe(result => {
                  localStorage.removeItem('order-bill');
                  // this.cookieService.delete('cart', '/');
                  const cartData1 = this.cookieService.get('checkout');
                  const entries1 = JSON.parse(cartData1);
                  this.cartData1 = new Map(entries1);

                  const cartData2 = this.cookieService.get('cart');
                  const entries = JSON.parse(cartData2);
                  this.cartData2 = new Map(entries);

                  this.cartData1.forEach((value, key) => {
                    const idKey = key.split('-');
                    const cartKey = `${idKey[0]}-${idKey[1]}-${idKey[2]}`;
                    this.cartData2.delete(cartKey);
                    this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData2.entries())));
                  });

                  this.cookieService.delete('checkout', '/');
                });
              },
            );
          }
        });
      }
      else {
        this.orderService.createOrder(this.order).subscribe(res => {
          if (res.status === 'OK') {
            this.order.code = res.data.code
            this.orderCurrent = res.data;
            const orderDetailPromises = this.listCart.map((item: { productDetailDTO: { id: any; price: any; }; quantity: any; }) => {
              const obj = {
                idOrder: res.data.id,
                idProductDetail: item.productDetailDTO.id,
                quantity: item.quantity,
                // price: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? (item.productDTO.price - item.productDTO.reducePrice) : item.productDTO.price,
                price: item.productDetailDTO.price,
                // codeDiscount: this.extractCodeDiscount(item.productDTO),
              };
              return this.orderDetailService.createOrderDetail(obj).toPromise();
            });
            forkJoin(orderDetailPromises).subscribe(
              orderDetailsResponses => {
                this.emailService.sendEmail(this.orderCurrent).subscribe(result => {
                  // localStorage.removeItem('order-bill');
                  // this.cookieService.delete('cart', '/');
                  // this.cookieService.delete('checkout', '/');

                  localStorage.removeItem('order-bill');
                  const cartData1 = this.cookieService.get('checkout');
                  const entries1 = JSON.parse(cartData1);
                  this.cartData1 = new Map(entries1);

                  const cartData2 = this.cookieService.get('cart');
                  const entries = JSON.parse(cartData2);
                  this.cartData2 = new Map(entries);

                  this.cartData1.forEach((value, key) => {
                    const idKey = key.split('-');
                    const cartKey = `${idKey[0]}-${idKey[1]}-${idKey[2]}`;
                    this.cartData2.delete(cartKey);
                    this.cartService.xoa(idKey[0], idKey[1], idKey[2], this.user.id).subscribe((res) => {
                      console.log(res)
                    })
                    this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData2.entries())));
                  });

                  this.cookieService.delete('checkout', '/');
                });
              }
            );
          }
        });
      }
    }
  }

  calculateTotal(price: number, quantity: number): string {
    const total = price * quantity;
    // return this.utilService.formatMoney(total);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(total)
      .replace('₫', '') + 'đ';
  }
}
