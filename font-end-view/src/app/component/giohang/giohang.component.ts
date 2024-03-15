import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {CartService} from '../../service/cart.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {UtilService} from '../../util/util.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-giohang',
  templateUrl: './giohang.component.html',
  styleUrls: ['./giohang.component.scss']
})
export class GiohangComponent implements OnInit {

  selectAll = false; // Trạng thái của ô checkbox header
  checkboxStatus: boolean[] = []; // Mảng trạng thái của các ô checkbox item
  listCart = [];
  cartData = new Map();
  checkOutData = new Map();
  totalMoney = 0;
  totalSaveMoney = 0;
  selectedProducts: any[] = [];
  disableCheckOut: boolean = false;


  constructor(private cartService: CartService, private cookieService: CookieService, private route: Router,
              private cdr: ChangeDetectorRef, public utilService: UtilService, private toastr: ToastrService) {
    if (this.cookieService.check('cart')) {
      this.cookieService.delete('checkout');
      const cartData = this.cookieService.get('cart');
      const entries = JSON.parse(cartData);
      this.cartData = new Map(entries);
      this.cartService.updateTotalProducts(this.cartData.size);
    }
  }

  ngOnInit(): void {
    // console.log(this.cartData);
    this.cartData.forEach((value, key) => {
      const idKey = key.split('-');
      this.cartService.getCart(idKey[0], idKey[1], idKey[2], value).subscribe(res => {
        this.listCart.push(res.data);
      });
      console.log(idKey);
      console.log(value, key);
    });
    console.log(this.listCart);
  }

  calculateTotal(price: number, quantity: number): string {
    const total = price * quantity;
    return this.utilService.formatMoney(total);
  }

  checkOut() {
    Swal.fire({
      title: 'Bạn có chắc thanh toán ?',
      text: '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý'
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


  giamSoLuong(obj) {
    const cartKey = `${obj.productId}-${obj.productDetailDTO.idColor}-${obj.productDetailDTO.idSize}`;
    if (this.cartData.has(cartKey)) {
      const currentQuantity = this.cartData.get(cartKey);
      if (currentQuantity === 1) {
        Swal.fire({
          title: 'Bạn có chắc chắn muốn xóa sản phẩm không ?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            this.toastr.success('Xoa Thanh Cong!', 'Remove', {
              positionClass: 'toast-top-right'
            });
            this.cartData.delete(cartKey);
            this.cookieService.set('cart', JSON.stringify([...this.cartData]));
            this.cartService.updateTotalProducts(this.cartData.size);
            window.location.reload();
          }
        });
      } else {
        // Giảm số lượng đi 1
        this.cartData.set(cartKey, currentQuantity - 1);
        this.cookieService.set('cart', JSON.stringify([...this.cartData]));
        const cartItem = this.listCart.find(c => c.productId === obj.productId && c.productDetailDTO.idColor === obj.productDetailDTO.idColor && c.productDetailDTO.idSize === obj.productDetailDTO.idSize);
        if (cartItem) {
          cartItem.quantity = this.cartData.get(cartKey);
        }
      }
      this.calculateTotalMoney();
      this.cdr.detectChanges();
    }
  }

  tangSoLuong(obj) {
    const cartKey = `${obj.productId}-${obj.productDetailDTO.idColor}-${obj.productDetailDTO.idSize}`;
    if (this.cartData.has(cartKey)) {
      const currentQuantity = this.cartData.get(cartKey);
      this.cartData.set(cartKey, currentQuantity + 1);
      this.cookieService.set('cart', JSON.stringify([...this.cartData]));
      const cartItem = this.listCart.find(c => c.productId === obj.productId && c.productDetailDTO.idColor === obj.productDetailDTO.idColor && c.productDetailDTO.idSize === obj.productDetailDTO.idSize);
      if (cartItem) {
        cartItem.quantity = this.cartData.get(cartKey);
      }
    }
    this.calculateTotalMoney();
    this.cdr.detectChanges();
  }

  deleteItem(obj) {
    const cartKey = `${obj.productId}-${obj.productDetailDTO.idColor}-${obj.productDetailDTO.idSize}`;
    if (this.cartData.has(cartKey)) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa sản phẩm không ?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartData.delete(cartKey);
          this.cookieService.set('cart', JSON.stringify([...this.cartData]));
          this.cartService.updateTotalProducts(this.cartData.size);
          window.location.reload();
          this.toastr.success('Xoa Thanh Cong!', 'Remove', {
            positionClass: 'toast-top-right'
          });
        }
      });
    }
    this.calculateTotalMoney();
    this.cdr.detectChanges();
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

  // Thay đổi trạng thái của checkbox dưới body và tính tổng lại khi có sự thay đổi
  toggleCheckbox(obj) {
    console.log(obj);
    this.selectAll = true;
    this.disableCheckOut = false;
    let countCheck = 0;
    this.selectedProducts = [];
    for (const c of this.listCart) {
      if (c.selected === true) {
        countCheck++;
        this.selectedProducts.push(c);
        console.log(this.selectedProducts);
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
    this.totalSaveMoney = 0;
    for (const c of this.listCart) {
      if (c.selected) {
        this.totalSaveMoney += c.productDTO.reducePrice * c.quantity;
        this.totalMoney += (c.productDTO.price * c.quantity) - (c.productDTO.reducePrice * c.quantity);
      }
    }
  }
}
