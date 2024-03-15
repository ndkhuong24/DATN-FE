import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrderDetailService} from '../../../service/order-detail.service';
import {CookieService} from 'ngx-cookie-service';
import {EmailService} from '../../../service/email.service';
import {UtilService} from '../../../util/util.service';
import {CartService} from '../../../service/cart.service';
import {OrderService} from '../../../service/order.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-detail-checkout',
  templateUrl: './detail-checkout.component.html',
  styleUrls: ['./detail-checkout.component.css']
})
export class DetailCheckoutComponent implements OnInit {

  listCart: any = [];
  order: any;
  // responsePayment: any = {
  //   vnp_CardType: null,
  //   vnp_BankCode: null,
  //
  // };
  statusPayment: any;
  email: any;
  user: any = {
    id: null,
    code: null,
    fullname: '',
    phone: '',
    email: '',
  };

  constructor(private route: ActivatedRoute, private orderDetailService: OrderDetailService,
              private cookieService: CookieService, private emailService: EmailService,
              public utilService: UtilService, private cartService: CartService, private orderService: OrderService) {
    const local = JSON.parse(localStorage.getItem('order-bill'));
    this.order = local.order;
    this.listCart = local.listCart;
    // this.email = session.email;
    this.statusPayment = this.route.snapshot.queryParamMap.get('vnp_TransactionStatus');
    // sessionStorage.removeItem('order');

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
    console.log(this.order);
    console.log(this.listCart);

    if (this.statusPayment === '00' && this.order.paymentType === 1) {
      if (this.user.id === null && this.user.code === null) {
        this.orderService.createOrderNotLogin(this.order).subscribe(res => {
          if (res.status === 'OK') {
            this.order = res.data;
            const orderDetailsObservables = this.listCart.map(item => {
              const obj = {
                idOrder: res.data.id,
                idProductDetail: item.productDetailDTO.id,
                quantity: item.quantity,
                price: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? (item.productDTO.price - item.productDTO.reducePrice) : item.productDTO.price,
                codeDiscount: this.extractCodeDiscount(item.productDTO),
              };
              return this.orderDetailService.createOrderDetail(obj);
            });
            forkJoin(orderDetailsObservables).subscribe(
              orderDetailsResponses => {
                console.log(orderDetailsResponses);
                this.emailService.sendEmail(this.order).subscribe(result => {
                  console.log('Send email thành công ');
                });
                localStorage.removeItem('order-bill');
                this.cookieService.delete('cart', '/');
                this.cookieService.delete('checkout', '/');
              },
              error => {
              }
            );
          }
        });
      }else {
        this.orderService.createOrder(this.order).subscribe(res => {
          if (res.status === 'OK') {
            this.order = res.data;
            const orderDetailsObservables = this.listCart.map(item => {
              const obj = {
                idOrder: res.data.id,
                idProductDetail: item.productDetailDTO.id,
                quantity: item.quantity,
                price: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? (item.productDTO.price - item.productDTO.reducePrice) : item.productDTO.price,
                codeDiscount: this.extractCodeDiscount(item.productDTO),
              };
              return this.orderDetailService.createOrderDetail(obj);
            });
            forkJoin(orderDetailsObservables).subscribe(
              orderDetailsResponses => {
                console.log(orderDetailsResponses);
                this.emailService.sendEmail(this.order).subscribe(result => {
                  console.log('Send email thành công ');
                });
                localStorage.removeItem('order-bill');
                this.cookieService.delete('cart', '/');
                this.cookieService.delete('checkout', '/');
              },
              error => {
              }
            );
          }
        });
      }

      // const orderDetailPromises = this.listCart.map(item => {
      //   const obj = {
      //     idOrder: this.order.id,
      //     idProductDetail: item.productDetailDTO.id,
      //     quantity: item.quantity,
      //     price: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? (item.productDTO.price - item.productDTO.reducePrice) : item.productDTO.price,
      //     codeDiscount: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? item.productDTO.codeDiscount : null,
      //   };
      //   return this.orderDetailService.createOrderDetail(obj).toPromise();
      // });

      // Promise.all(orderDetailPromises)
      //   .then(() => {
      //     if (this.email === null || this.email === undefined) {
      //       this.emailService.sendEmail(this.order).subscribe(res => {
      //       });
      //     } else {
      //       const obj = {
      //         ...this.order,
      //         email: this.email
      //       };
      //       this.emailService.sendEmailNotLogin(obj).subscribe(res => {
      //       });
      //     }
      //   })
      //   .catch(error => {
      //     console.error('Error creating order details:', error);
      //   })
      //   .finally(() => {
      //   });
    }
    if (this.order.paymentType === 0) {
      if(this.user.id === null && this.user.code === null){
        this.orderService.createOrderNotLogin(this.order).subscribe(res => {
          if (res.status === 'OK') {
            this.order = res.data;
            const orderDetailPromises = this.listCart.map(item => {
              const obj = {
                idOrder: res.data.id,
                idProductDetail: item.productDetailDTO.id,
                quantity: item.quantity,
                price: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? (item.productDTO.price - item.productDTO.reducePrice) : item.productDTO.price,
                codeDiscount: this.extractCodeDiscount(item.productDTO),
              };
              return this.orderDetailService.createOrderDetail(obj).toPromise();
            });
            forkJoin(orderDetailPromises).subscribe(
              orderDetailsResponses => {
                console.log(orderDetailsResponses);
                this.emailService.sendEmail(this.order).subscribe(result => {
                  console.log('Send email thành công ');
                });
                localStorage.removeItem('order-bill');
                this.cookieService.delete('cart', '/');
                this.cookieService.delete('checkout', '/');
              },
              error => {
              }
            );
          }
        });
      }else {
        this.orderService.createOrder(this.order).subscribe(res => {
          if (res.status === 'OK') {
            this.order = res.data;
            const orderDetailPromises = this.listCart.map(item => {
              const obj = {
                idOrder: res.data.id,
                idProductDetail: item.productDetailDTO.id,
                quantity: item.quantity,
                price: item.productDTO?.reducePrice != null || item.productDTO?.percentageReduce != null ? (item.productDTO.price - item.productDTO.reducePrice) : item.productDTO.price,
                codeDiscount: this.extractCodeDiscount(item.productDTO),
              };
              return this.orderDetailService.createOrderDetail(obj).toPromise();
            });
            forkJoin(orderDetailPromises).subscribe(
              orderDetailsResponses => {
                console.log(orderDetailsResponses);
                this.emailService.sendEmail(this.order).subscribe(result => {
                  console.log('Send email thành công ');
                });
                localStorage.removeItem('order-bill');
                this.cookieService.delete('cart', '/');
                this.cookieService.delete('checkout', '/');
              },
              error => {
              }
            );
          }
        });
      }
    }
  }


  calculateTotal(price: number, quantity: number): string {
    const total = price * quantity;
    return this.utilService.formatMoney(total);
  }

  extractCodeDiscount(productDTO): string | null {
    return productDTO?.reducePrice != null || productDTO?.percentageReduce != null ?
      productDTO.codeDiscount : null;
  }

  openHome() {
  }

}
