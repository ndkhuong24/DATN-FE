import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { UtilService } from '../../util/util.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-giohang',
  templateUrl: './giohang.component.html',
  styleUrls: ['./giohang.component.scss']
})
export class GiohangComponent implements OnInit {
  selectAll = false;
  checkboxStatus: boolean[] = [];
  listCart = [];
  cartData = new Map();
  checkOutData = new Map();
  totalMoney = 0;
  totalSaveMoney = 0;
  selectedProducts: any[] = [];
  disableCheckOut: boolean = false;
  infoCustomer: any;

  constructor(
    private cartService: CartService,
    private cookieService: CookieService,
    private route: Router,
    private cdr: ChangeDetectorRef,
    public utilService: UtilService,
    private toastr: ToastrService
  ) {
    this.infoCustomer = JSON.parse(localStorage.getItem('customer'));

    this.cookieService.delete('checkout');
    let cartData = this.cookieService.get('cart');
    if (!cartData) {
      cartData = JSON.stringify([]);
      this.cookieService.set('cart', cartData);
    }
    const entries = JSON.parse(cartData);
    this.cartData = new Map(entries);
    this.cartService.updateTotalProducts(this.cartData.size);

    if (this.infoCustomer) {
      this.cartService.getCartCustomer(this.infoCustomer.id).subscribe(res => {
        if (res && res.success) {
          if (Array.isArray(res.data)) {
            res.data.forEach(item => {
              if (item && item.quantity !== undefined) {
                this.updateCookieWithServerCart(item);
              } else {
                this.showErrorNotification('Dữ liệu không hợp lệ.');
              }
            });
          } else {
            this.showErrorNotification('Dữ liệu trả về không hợp lệ.');
          }
        } else {
          this.showErrorNotification(res.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng.');
        }
      });
    }

    // if (this.cookieService.check('cart')) {
    //   if (this.infoCustomer) {
    //     this.cartService.getCartCustomer(this.infoCustomer.id).subscribe(res => {
    //       if (res && res.success) {
    //         if (Array.isArray(res.data)) {
    //           res.data.forEach(item => {
    //             if (item && item.quantity !== undefined) {
    //               this.updateCookieWithServerCart(item);
    //             } else {
    //               this.showErrorNotification('Dữ liệu không hợp lệ.');
    //             }
    //           });
    //         } else {
    //           this.showErrorNotification('Dữ liệu trả về không hợp lệ.');
    //         }
    //       } else {
    //         this.showErrorNotification(res.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng.');
    //       }
    //     });
    //   }
    // }
  }

  ngOnInit(): void {
    this.cartData.forEach((value, key) => {
      const idKey = key.split('-');
      this.cartService.getCart(idKey[0], idKey[1], idKey[2], value).subscribe(res => {
        this.listCart.push(res.data);
      });
    });
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

  calculateTotal(price: number, quantity: number): string {
    const total = price * quantity;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(total)
      .replace('₫', '') + 'đ';
  }

  giamSoLuong(obj: { productId: any; productDetailDTO: { idColor: any; idSize: any; }; }) {
    const cartKey = `${obj.productId}-${obj.productDetailDTO.idColor}-${obj.productDetailDTO.idSize}`;

    if (this.cartData.has(cartKey)) {
      if (this.infoCustomer) {
        const currentQuantity = this.cartData.get(cartKey);
        if (currentQuantity === 1) {
          Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm không',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Thoát',
          }).then((result) => {
            this.cartData.delete(cartKey);
            this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())));
            this.listCart = this.listCart.filter(c => !(c.productId === obj.productId && c.productDetailDTO.idColor === obj.productDetailDTO.idColor && c.productDetailDTO.idSize === obj.productDetailDTO.idSize)); // Xóa sản phẩm khỏi giao diện
            this.cartService.updateTotalProducts(this.cartData.size);
            this.calculateTotalMoney();
            this.cdr.detectChanges();
            this.cartService.giamSoLuong(obj.productId, obj.productDetailDTO.idColor, obj.productDetailDTO.idSize, this.infoCustomer.id).subscribe((res: any) => {
              this.handleServerResponse(res);
            })
          })
        } else {
          this.cartData.set(cartKey, currentQuantity - 1);
          this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())));
          const cartItem = this.listCart.find(c => c.productId === obj.productId && c.productDetailDTO.idColor === obj.productDetailDTO.idColor && c.productDetailDTO.idSize === obj.productDetailDTO.idSize);
          if (cartItem) {
            cartItem.quantity = this.cartData.get(cartKey);
            this.cartService.giamSoLuong(obj.productId, obj.productDetailDTO.idColor, obj.productDetailDTO.idSize, this.infoCustomer.id).subscribe((res: any) => {
              this.handleServerResponse(res);
              this.showSuccessNotification('Xóa sản phẩm khỏi giỏ thành công');
            })
          }
        }
        this.calculateTotalMoney();
        this.cdr.detectChanges();
      } else {
        const currentQuantity = this.cartData.get(cartKey);
        if (currentQuantity === 1) {
          Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm không',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Thoát',
          }).then((result) => {
            if (result.isConfirmed) {
              this.cartData.delete(cartKey);
              this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())));
              this.listCart = this.listCart.filter(c => !(c.productId === obj.productId && c.productDetailDTO.idColor === obj.productDetailDTO.idColor && c.productDetailDTO.idSize === obj.productDetailDTO.idSize)); // Xóa sản phẩm khỏi giao diện
              this.cartService.updateTotalProducts(this.cartData.size);
              this.calculateTotalMoney();
              this.cdr.detectChanges();
            }
          });
        } else {
          this.cartData.set(cartKey, currentQuantity - 1);
          this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())));
          const cartItem = this.listCart.find(c => c.productId === obj.productId && c.productDetailDTO.idColor === obj.productDetailDTO.idColor && c.productDetailDTO.idSize === obj.productDetailDTO.idSize);
          if (cartItem) {
            cartItem.quantity = this.cartData.get(cartKey);
          }
        }
        this.calculateTotalMoney();
        this.cdr.detectChanges();
      }
    }
  }

  handleServerResponse(res: any) {
    if (res && res.success) {
      if (Array.isArray(res.data)) {
        res.data.forEach((item: { quantity: any; }) => {
          if (item && item.quantity !== undefined) {
            this.updateCookieWithServerCart(item);
          } else {
            this.showErrorNotification('Dữ liệu không hợp lệ.');
          }
        });
      } else {
        this.showErrorNotification('Dữ liệu trả về không hợp lệ.');
      }
    } else {
      this.showErrorNotification(res.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng.');
    }
  }

  tangSoLuong(obj: { productId: any; productDetailDTO: { idColor: any; idSize: any; }; }) {
    const cartKey = `${obj.productId}-${obj.productDetailDTO.idColor}-${obj.productDetailDTO.idSize}`;

    if (this.cartData.has(cartKey)) {
      if (this.infoCustomer) {
        const currentQuantity = this.cartData.get(cartKey);

        this.cartData.set(cartKey, currentQuantity + 1);

        this.cookieService.set('cart', JSON.stringify([...this.cartData]));

        const cartItem = this.listCart.find(c => c.productId === obj.productId && c.productDetailDTO.idColor === obj.productDetailDTO.idColor && c.productDetailDTO.idSize === obj.productDetailDTO.idSize);

        if (cartItem) {
          cartItem.quantity = this.cartData.get(cartKey);
        }

        this.calculateTotalMoney();
        this.cdr.detectChanges();

        this.cartService.tangSoLuong(obj.productId, obj.productDetailDTO.idColor, obj.productDetailDTO.idSize, this.infoCustomer.id).subscribe((res: any) => {
          this.handleServerResponse(res);
          this.showSuccessNotification('Thêm sản phẩm thành công');
        })
      }
      else {
        const currentQuantity = this.cartData.get(cartKey);

        this.cartData.set(cartKey, currentQuantity + 1);

        this.cookieService.set('cart', JSON.stringify([...this.cartData]));

        const cartItem = this.listCart.find(c => c.productId === obj.productId && c.productDetailDTO.idColor === obj.productDetailDTO.idColor && c.productDetailDTO.idSize === obj.productDetailDTO.idSize);

        if (cartItem) {
          cartItem.quantity = this.cartData.get(cartKey);
        }

        this.calculateTotalMoney();
        this.cdr.detectChanges();
      }
    }
  }

  deleteItem(obj: { productId: any; productDetailDTO: { idColor: any; idSize: any; }; }) {
    const cartKey = `${obj.productId}-${obj.productDetailDTO.idColor}-${obj.productDetailDTO.idSize}`;

    if (this.cartData.has(cartKey)) {

      if (this.infoCustomer) {
        Swal.fire({
          title: 'Bạn có chắc chắn muốn xóa sản phẩm không',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Thoát',
        }).then((result) => {
          if (result.isConfirmed) {
            this.cartData.delete(cartKey);
            this.cookieService.set('cart', JSON.stringify([...this.cartData]));
            this.cartService.updateTotalProducts(this.cartData.size);
            this.cartService.xoa(obj.productId, obj.productDetailDTO.idColor, obj.productDetailDTO.idSize, this.infoCustomer.id).subscribe((res: any) => {
              this.handleServerResponse(res);
              window.location.reload();
              this.toastr.success('Xóa thành công', 'Remove', {
                positionClass: 'toast-top-right'
              });
            })
          }
        });
        this.calculateTotalMoney();
        this.cdr.detectChanges();
      }
      else {
        Swal.fire({
          title: 'Bạn có chắc chắn muốn xóa sản phẩm không',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Thoát',
        }).then((result) => {
          if (result.isConfirmed) {
            this.cartData.delete(cartKey);
            this.cookieService.set('cart', JSON.stringify([...this.cartData]));
            this.cartService.updateTotalProducts(this.cartData.size);
            window.location.reload();
            this.toastr.success('Xóa thành công', 'Remove', {
              positionClass: 'toast-top-right'
            });
          }
        });
        this.calculateTotalMoney();
        this.cdr.detectChanges();
      }
    }

  }

  toggleSelectAll() {
    this.disableCheckOut = false;
    this.selectedProducts = [];
    for (const c of this.listCart) {
      if (this.selectAll == true) {
        this.selectedProducts = this.listCart;
        this.disableCheckOut = true;
      }
      c.selected = this.selectAll;
    }
    this.calculateTotalMoney();
    this.cdr.detectChanges();
  }

  toggleCheckbox(obj: any) {
    this.selectAll = true;
    this.disableCheckOut = false;
    let countCheck = 0;
    this.selectedProducts = [];
    for (const c of this.listCart) {
      if (c.selected === true) {
        countCheck++;
        this.selectedProducts.push(c);
        this.disableCheckOut = true;
      } else {
        this.selectAll = false;
      }
    }
    if (countCheck === 0) {
      this.selectAll = false;
    }
    this.calculateTotalMoney();
    this.cdr.detectChanges();
  }

  calculateTotalMoney() {
    this.totalMoney = 0;
    for (const c of this.listCart) {
      if (c.selected) {
        this.totalMoney += (c.productDetailDTO.price * c.quantity);
      }
    }
  }

  checkOut() {
    Swal.fire({
      title: 'Bạn có chắc thanh toán',
      text: '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Thoát'
    }).then((result) => {
      if (result.isConfirmed) {
        const expirationDate = new Date();

        expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000);

        this.cookieService.set('checkout', JSON.stringify(Array.from(this.selectedProducts)), expirationDate);

        for (const c of this.selectedProducts) {
          const key = c.productId + '-' + c.productDetailDTO.idColor + '-' + c.productDetailDTO.idSize;
          this.checkOutData.set(key, c.quantity);
        }
        this.cookieService.set('checkout', JSON.stringify(Array.from(this.checkOutData.entries())), expirationDate);

        this.route.navigate(['/cart/checkout']);
      }
    });
  }
}
