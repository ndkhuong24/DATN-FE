import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColorService} from '../../service/color.service';
import {SizeService} from '../../service/size.service';
import {CookieService} from 'ngx-cookie-service';
import {UtilService} from '../../util/util.service';
import {CartService} from '../../service/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  cartData = new Map();
  productData = new Map();
  listProductTuongTu = [];
  isMouseOver: { [key: number]: boolean } = {};
  quantityBuy: number = 1;

  constructor(private productService: ProductService, private activeRoute: ActivatedRoute,
              private colorService: ColorService, private sizeService: SizeService,
              private cookieService: CookieService, private router: Router, public utilService: UtilService,
              private cartService: CartService, private cdr: ChangeDetectorRef) {
    // @ts-ignore
    window.scrollTo(top, 0, 0);
    if (this.cookieService.check('cart')) {
      const cartData = this.cookieService.get('cart');
      const entries = JSON.parse(cartData);
      this.cartData = new Map(entries);
      this.cartService.updateTotalProducts(this.cartData.size);
    }

  }

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

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      const id = params.idProduct;
      this.productService.getDetailProduct(id).subscribe(res => {
        this.product = res.data;
        this.productService.getProductTuongTu(res.data.id, res.data.categoryDTO.id).subscribe(res2 => {
          this.listProductTuongTu = res2;
          console.log(this.listProductTuongTu);
          this.cdr.detectChanges();
        });
        console.log(this.product);
        this.loadData();
      });
    });
  }

  private loadData(): void {
    if (this.product && this.product.productDetailDTOList) {
      this.colorService.getAllColor().subscribe(res => {
        this.listColor = res;

        const colorIDsInProduct = this.product.productDetailDTOList
          .filter(detail => detail.idColor)
          .map(detail => detail.idColor);

        this.listColor = this.listColor.filter(color => colorIDsInProduct.includes(color.id));
        this.originalListColor = [...this.listColor];
      });

      this.sizeService.getAllSize().subscribe(res => {
        this.listSize = res;
        const sizeIDsInProduct = this.product.productDetailDTOList
          .filter(detail => detail.idSize)
          .map(detail => detail.idSize);

        this.listSize = this.listSize.filter(size => sizeIDsInProduct.includes(size.id));
        this.originalListSize = [...this.listSize];
      });
    }
  }


  selectSize(s) {
    console.log(s);

    if (s.isSelected) {
      this.listSize.forEach(size => {
        size.isSelected = false;
        size.disabled = false;
      });
      this.listColor.forEach(color => {
        color.disabled = false;
      });
      this.sizeId = null;
      this.checkIfBothSizeAndColorSelected();
      return; // Thoát khỏi hàm sớm
    }

    // Xóa lựa chọn trước đó
    // this.listSize.forEach(size => {
    //   size.isSelected = false;
    //   size.disabled = false;
    // });

    const selectedSizeId = s.id;
    const colorIDsForSelectedSize = this.product.productDetailDTOList
      .filter(detail => detail.idSize === parseInt(String(selectedSizeId), 10) && detail.idColor && detail.quantity > 0)
      .map(detail => detail.idColor);

    if (this.sizeId != null) {
      const previousSelectedSize = this.listSize.find(size => size.id === this.sizeId);
      if (previousSelectedSize) {
        // Bỏ chọn size trước đó
        previousSelectedSize.isSelected = false;
      }
    }
    // Cập nhật kích thước đã chọn
    s.isSelected = true;
    // Vô hiệu hóa các màu không khả dụng cho kích thước đã chọn
    this.listColor.forEach(color => {
      color.disabled = !colorIDsForSelectedSize.includes(color.id);
    });

    this.sizeId = selectedSizeId;
    this.checkIfBothSizeAndColorSelected();
  }


  selectColor(c) {
    if (c.isSelected) {
      this.listColor.forEach(color => {
        color.disabled = false;
        color.isSelected = false;
      });
      this.listSize.forEach(size => {
        size.disabled = false;
      });
      this.colorId = null;
      this.checkIfBothSizeAndColorSelected();
      return; // Thoát khỏi hàm sớm
    }

    // this.listColor.forEach(color => {
    //   color.disabled = false;
    //   color.isSelected = false;
    // });

    const selectedColorId = c.id;
    const colorIDsForSelectedSize = this.product.productDetailDTOList
      .filter(detail => detail.idColor === parseInt(String(selectedColorId), 10) && detail.idColor && detail.quantity > 0)
      .map(detail => detail.idSize);

    if (this.colorId != null) {
      const previousSelectedColor = this.listColor.find(color => color.id === this.colorId);
      if (previousSelectedColor) {
        // Bỏ chọn size trước đó
        previousSelectedColor.isSelected = false;
      }
    }
    c.isSelected = true;

    this.listSize.forEach(size => {
      size.disabled = !colorIDsForSelectedSize.includes(size.id);
    });
    this.colorId = selectedColorId;
    this.checkIfBothSizeAndColorSelected();
  }

  checkIfBothSizeAndColorSelected() {
    this.bothSizeAndColorSelected = this.colorId !== null && this.sizeId !== null && this.getProductDetailQuantity() > 0;
  }

  getProductDetailQuantity(): number {
    if (this.sizeId !== null && this.colorId !== null) {
      const selectedProductDetail = this.product.productDetailDTOList.find(
        detail => detail.idSize === parseInt(String(this.sizeId), 10) && detail.idColor === parseInt(String(this.colorId), 10)
      );
      if (selectedProductDetail) {
        return selectedProductDetail.quantity;
      }
    }
    return -1;
  }


  addToCart(product: number) {
    const productKey = product + '-' + this.colorId + '-' + this.sizeId;
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000);
    if (this.cartData.has(productKey)) {
      const slHienTai = this.cartData.get(productKey);
      this.cartData.set(productKey, slHienTai + this.quantityBuy);
      this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())), expirationDate);
      Swal.fire({
        icon: 'success',
        title: 'Thêm vào giỏ thành công',
        showConfirmButton: false,
        timer: 1500
      });
      this.quantityBuy = 1;
    } else {
      this.cartData.set(productKey, this.quantityBuy);
      this.cookieService.set('cart', JSON.stringify(Array.from(this.cartData.entries())), expirationDate);
      Swal.fire({
        icon: 'success',
        title: 'Thêm vào giỏ thành công',
        showConfirmButton: false,
        timer: 1500
      });
      this.quantityBuy = 1;
    }
    this.cartService.updateTotalProducts(this.cartData.size);
  }

  buyNow(productId: any) {
    Swal.fire({
      title: 'Bạn có chắc mua ngay?',
      text: '',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý'
    }).then((result) => {
      if (result.isConfirmed) {
        const productKey = productId + '-' + this.colorId + '-' + this.sizeId;
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000);
        this.productData.set(productKey, this.quantityBuy);
        this.cookieService.set('checkout', JSON.stringify(Array.from(this.productData.entries())), expirationDate);
        this.router.navigate(['cart/checkout']);
      }
    });
  }

  onMouseEnter(product: any) {
    // Khi chuột di vào, cập nhật isMouseOver của sản phẩm này thành true
    this.isMouseOver[product.id] = true;
  }

  onMouseLeave(product: any) {
    // Khi chuột rời khỏi, cập nhật isMouseOver của sản phẩm này thành false
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
    // console.log("Size: ", event);
    // const selectedSizeId = this.sizeId;
    if (this.product && this.product.productDetailDTOList) {
      if (this.sizeId === null) {
        this.listColor = [...this.originalListColor];
      } else {
        this.listColor = [...this.originalListColor];
        const detailsForSelectedSize = this.product.productDetailDTOList
          .filter(detail => detail.idSize === this.sizeId && detail.idColor);
        const colorIDsForSelectedSize = detailsForSelectedSize.map(detail => detail.idColor);
        this.listColor = this.listColor.filter(color => colorIDsForSelectedSize.includes(color.id));
      }
    }
    this.checkIfBothSizeAndColorSelected();
    this.cdr.detectChanges();
  }

  onColorChange(event: any): void {
    console.log(event);
    // const selectedColorId = this.colorId;
    if (this.product && this.product.productDetailDTOList) {
      if (this.colorId === null) {
        this.listSize = [...this.originalListSize];
      } else {
        this.listSize = [...this.originalListSize];
        const detailsForSelectedColor = this.product.productDetailDTOList
          .filter(detail => detail.idColor === this.colorId && detail.idSize);

        const sizeIDsForSelectedColor = detailsForSelectedColor.map(detail => detail.idSize);

        this.listSize = this.listSize.filter(size => sizeIDsForSelectedColor.includes(size.id));
      }

    }
    this.checkIfBothSizeAndColorSelected();
    this.cdr.detectChanges();
  }

  checkQuantity() {
    const regex = /^\d+$/;
    if (this.quantityBuy === undefined || this.quantityBuy === null || JSON.stringify(this.quantityBuy) === '') {
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
