import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColorService } from '../../service/color.service';
import { SizeService } from '../../service/size.service';
import { CookieService } from 'ngx-cookie-service';
import { UtilService } from '../../util/util.service';
import { CartService } from '../../service/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})

export class DetailsComponent implements OnInit {
  cartData = new Map();
  productData = new Map();
  listProductTuongTu = [];
  isMouseOver: { [key: number]: boolean } = {};
  quantityBuy: number = 1;
  infoCustomer: any;
  product: any;
  listColor = [];
  listSize = [];
  originalListColor = [];
  originalListSize = [];
  sizeBefore: number;
  colorId: number | null = null;
  sizeId: number | null = null;
  bothSizeAndColorSelected: boolean = false;
  validQuantityBuy: boolean = false;
  validQuantityBuyMess = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  showShoeCollar: boolean = false;
  shoeCollar: null;

  constructor(
    private productService: ProductService,
    private activeRoute: ActivatedRoute,
    private colorService: ColorService,
    private sizeService: SizeService,
    private cookieService: CookieService,
    private router: Router,
    public utilService: UtilService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {
    if (this.cookieService.check('cart')) {
      const cartData = this.cookieService.get('cart');
      const entries = JSON.parse(cartData);
      this.cartData = new Map(entries);
      this.cartService.updateTotalProducts(this.cartData.size);
    }
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      const id = params.idProduct;

      this.productService.getDetailProduct(id).subscribe((res) => {
        if (res.message === 'Sản phẩm không hợp lệ hoặc đã bị xóa!') {
          this.router.navigate(['/home']);
        } else {
          this.product = res.data;

          this.productService.getProductTuongTu(res.data.id, res.data.categoryDTO.id).subscribe((res2) => {
            this.listProductTuongTu = res2;
            this.cdr.detectChanges();
          });

          this.loadData();
        }

      });
    });

    this.infoCustomer = JSON.parse(localStorage.getItem('customer'));
  }

  private loadData(): void {
    if (this.product && this.product.productDetailDTOList) {
      this.colorService.getAllColor().subscribe((res) => {
        this.listColor = res;

        const colorIDsInProduct = this.product.productDetailDTOList
          .filter((detail: { idColor: any }) => detail.idColor)
          .map((detail: { idColor: any }) => detail.idColor);

        this.listColor = this.listColor.filter((color) =>
          colorIDsInProduct.includes(color.id)
        );
        this.originalListColor = [...this.listColor];
      });

      this.sizeService.getAllSize().subscribe((res) => {
        this.listSize = res;
        const sizeIDsInProduct = this.product.productDetailDTOList
          .filter((detail: { idSize: any }) => detail.idSize)
          .map((detail: { idSize: any }) => detail.idSize);

        this.listSize = this.listSize.filter((size) =>
          sizeIDsInProduct.includes(size.id)
        );
        this.originalListSize = [...this.listSize];
      });
      // Calculate min and max prices
      const prices = this.product.productDetailDTOList
        .filter((detail: { price: null }) => detail.price != null)
        .map((detail: { price: any }) => detail.price);

      if (prices.length > 0) {
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
      } else {
        this.minPrice = null;
        this.maxPrice = null;
      }
    }
  }

  selectSize(s: { isSelected: boolean; id: any }) {
    if (s.isSelected) {
      this.listSize.forEach((size) => {
        size.isSelected = false;
        size.disabled = false;
      });
      this.listColor.forEach((color) => {
        color.disabled = false;
      });
      this.sizeId = null;
      this.checkIfBothSizeAndColorSelected();
      return; // Thoát khỏi hàm sớm
    }

    const selectedSizeId = s.id;
    const colorIDsForSelectedSize = this.product.productDetailDTOList
      .filter(
        (detail: { idSize: number; idColor: any; quantity: number }) =>
          detail.idSize === parseInt(String(selectedSizeId), 10) &&
          detail.idColor &&
          detail.quantity > 0
      )
      .map((detail: { idColor: any }) => detail.idColor);

    if (this.sizeId != null) {
      const previousSelectedSize = this.listSize.find(
        (size) => size.id === this.sizeId
      );
      if (previousSelectedSize) {
        // Bỏ chọn size trước đó
        previousSelectedSize.isSelected = false;
      }
    }
    // Cập nhật kích thước đã chọn
    s.isSelected = true;
    // Vô hiệu hóa các màu không khả dụng cho kích thước đã chọn
    this.listColor.forEach((color) => {
      color.disabled = !colorIDsForSelectedSize.includes(color.id);
    });

    this.sizeId = selectedSizeId;
    this.checkIfBothSizeAndColorSelected();
  }

  selectColor(c: { isSelected: boolean; id: any }) {
    if (c.isSelected) {
      this.listColor.forEach((color) => {
        color.disabled = false;
        color.isSelected = false;
      });
      this.listSize.forEach((size) => {
        size.disabled = false;
      });
      this.colorId = null;
      this.checkIfBothSizeAndColorSelected();
      return; // Thoát khỏi hàm sớm
    }

    const selectedColorId = c.id;
    const colorIDsForSelectedSize = this.product.productDetailDTOList
      .filter(
        (detail: { idColor: number; quantity: number }) =>
          detail.idColor === parseInt(String(selectedColorId), 10) &&
          detail.idColor &&
          detail.quantity > 0
      )
      .map((detail: { idSize: any }) => detail.idSize);

    if (this.colorId != null) {
      const previousSelectedColor = this.listColor.find(
        (color) => color.id === this.colorId
      );
      if (previousSelectedColor) {
        // Bỏ chọn size trước đó
        previousSelectedColor.isSelected = false;
      }
    }
    c.isSelected = true;

    this.listSize.forEach((size) => {
      size.disabled = !colorIDsForSelectedSize.includes(size.id);
    });
    this.colorId = selectedColorId;
    this.checkIfBothSizeAndColorSelected();
  }

  checkIfBothSizeAndColorSelected() {
    this.bothSizeAndColorSelected =
      this.colorId !== null &&
      this.sizeId !== null &&
      this.getProductDetailQuantity() > 0;
  }

  getProductDetailQuantity(): number {
    if (this.sizeId !== null && this.colorId !== null) {
      const selectedProductDetail = this.product.productDetailDTOList.find(
        (detail: { idSize: number; idColor: number }) =>
          detail.idSize === parseInt(String(this.sizeId), 10) &&
          detail.idColor === parseInt(String(this.colorId), 10)
      );
      if (selectedProductDetail) {
        this.showShoeCollar = true
        this.shoeCollar = selectedProductDetail.shoeCollar;
        return selectedProductDetail.quantity;
      }
    }
    return -1;
  }

  getProductDetailprice(): number {
    if (this.sizeId !== null && this.colorId !== null) {
      const selectedProductDetail = this.product.productDetailDTOList.find(
        (detail: { idSize: number; idColor: number; }) =>
          detail.idSize === parseInt(String(this.sizeId), 10) &&
          detail.idColor === parseInt(String(this.colorId), 10)
      );
      if (selectedProductDetail) {
        return selectedProductDetail.price;
      }
    }
    return -1;
  }

  addToCart(product: number) {
    if (this.infoCustomer) {
      this.cartService.addToCartCustomer(product, this.colorId, this.sizeId, this.quantityBuy, this.infoCustomer.id)
        .subscribe((res: any) => {
          this.handleServerResponse(res)
        }
        );
    } else {
      this.handleLocalCart(product);
    }
  }

  handleServerResponse(res: any): void {
    if (res && res.success) {
      if (Array.isArray(res.data)) {
        res.data.forEach((item: { quantity: any; }) => {
          if (item && item.quantity !== undefined) {
            this.updateCookieWithServerCart(item);
          } else {
            this.showErrorNotification('Dữ liệu không hợp lệ.');
          }
        });
      }
      else {
        this.showErrorNotification('Dữ liệu trả về không hợp lệ.');
      }
    }
  }

  updateCookieWithServerCart(data: any) {
    const productKey = data.idProduct + '-' + data.idColor + '-' + data.idSize;

    this.cartData.set(productKey, data.quantity);

    this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())));

    this.showSuccessNotification('Thêm vào giỏ thành công');

    this.cartService.updateTotalProducts(this.cartData.size);
  }

  handleLocalCart(product: number) {
    const productKey = product + '-' + this.colorId + '-' + this.sizeId;
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000); // 30 phút

    if (this.cartData.has(productKey)) {
      const currentQuantity = this.cartData.get(productKey);
      this.cartData.set(productKey, currentQuantity + this.quantityBuy);
    } else {
      this.cartData.set(productKey, this.quantityBuy);
    }

    this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())), expirationDate);

    this.showSuccessNotification('Thêm vào giỏ thành công');
    this.quantityBuy = 1;
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

  buyNow(productId: any) {
    Swal.fire({
      title: 'Bạn có chắc mua ngay',
      text: '',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Thoát'
    }).then((result) => {
      if (result.isConfirmed) {
        const productKey = productId + '-' + this.colorId + '-' + this.sizeId;
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000);
        this.productData.set(productKey, this.quantityBuy);
        this.cookieService.set(
          'checkout',
          JSON.stringify(Array.from(this.productData.entries())),
          expirationDate
        );
        this.router.navigate(['cart/checkout']);
      }
    });
  }

  onMouseEnter(product: any) {
    this.isMouseOver[product.id] = true;
  }

  onMouseLeave(product: any) {
    this.isMouseOver[product.id] = false;
  }

  giamSoLuong() {
    this.quantityBuy = this.quantityBuy - 1;
    this.checkQuantity();
  }

  tangSoLuong() {
    this.quantityBuy = this.quantityBuy + 1;
    this.checkQuantity();
  }

  onSizeChange(event: any): void {
    const selectedSizeId = this.sizeId;
    if (this.product && this.product.productDetailDTOList) {
      if (this.sizeId === null) {
        this.listColor = [...this.originalListColor];
      } else {
        this.listColor = [...this.originalListColor];
        const detailsForSelectedSize = this.product.productDetailDTOList.filter(
          (detail) => detail.idSize === this.sizeId && detail.idColor
        );
        const colorIDsForSelectedSize = detailsForSelectedSize.map(
          (detail) => detail.idColor
        );

        this.listColor = this.listColor.map(color => {
          if (colorIDsForSelectedSize.includes(color.id)) {
            return color;
          } else {
            return {
              ...color,
              disabled: true
            };
          }
        });
      }
    }
    this.checkIfBothSizeAndColorSelected();
    this.cdr.detectChanges();
  }

  onColorChange(event: any): void {
    if (this.product && this.product.productDetailDTOList) {
      if (this.colorId === null) {
        this.listSize = [...this.originalListSize];
      } else {
        this.listSize = [...this.originalListSize];
        const detailsForSelectedColor =
          this.product.productDetailDTOList.filter(
            (detail: { idColor: number; idSize: any; }) => detail.idColor === this.colorId && detail.idSize
          );

        const sizeIDsForSelectedColor = detailsForSelectedColor.map(
          (detail: { idSize: any; }) => detail.idSize
        );

        this.listSize = this.listSize.map(size => {
          if (sizeIDsForSelectedColor.includes(size.id)) {
            return size;
          } else {
            return {
              ...size,
              disabled: true
            };
          }
        });
      }
    }
    this.checkIfBothSizeAndColorSelected();
    this.cdr.detectChanges();
  }

  toggleRadio(event: Event, type: string, id: number) {
    event.preventDefault();
    event.stopPropagation();

    if (type === 'size') {
      if (this.sizeId === id) {
        this.sizeId = null;
      } else {
        this.sizeId = id;
      }
    } else if (type === 'color') {
      if (this.colorId === id) {
        this.colorId = null;
      } else {
        this.colorId = id;
      }
    }

    this.checkIfBothSizeAndColorSelected();
  }

  checkQuantity() {
    const regex = /^\d+$/;
    if (
      this.quantityBuy === undefined ||
      this.quantityBuy === null ||
      JSON.stringify(this.quantityBuy) === ''
    ) {
      this.validQuantityBuy = true;
      this.validQuantityBuyMess = 'Vui lòng nhập số lượng mua';
      return;
    } else if (!regex.test(JSON.stringify(this.quantityBuy))) {
      this.validQuantityBuy = true;
      this.validQuantityBuyMess = 'Vui lòng nhập số lượng mua phải là số';
      return;
    } else if (this.quantityBuy <= 0) {
      this.validQuantityBuy = true;
      this.validQuantityBuyMess = 'Số lượng mua phải lớn hơn 0';
      return;
    } else if (this.quantityBuy > this.getProductDetailQuantity()) {
      this.validQuantityBuy = true;
      this.validQuantityBuyMess = 'Số lượng mua đã lớn hơn số lượng hiện có';
      return;
    }
    this.validQuantityBuy = false;
    this.validQuantityBuyMess = null;
  }
}
