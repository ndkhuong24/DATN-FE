import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { UtilService } from '../../util/util.service';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../service/cart.service';
import { BrandService } from '../../service/brand.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cartData = new Map();

  constructor(
    private productService: ProductService,
    public utilService: UtilService,
    private cookieService: CookieService,
    private cartService: CartService,
    private brandService: BrandService,
    private cdr: ChangeDetectorRef
  ) {
    if (this.cookieService.check('cart')) {
      this.cookieService.delete('checkout');
      const cartData = this.cookieService.get('cart');
      const entries = JSON.parse(cartData);
      this.cartData = new Map(entries);
      this.cartService.updateTotalProducts(this.cartData.size);
    }
  }

  listProductNoiBat = [];
  listBrand = [];
  idBrand: number = null;

  ngOnInit(): void {
    this.getProductNoiBat(0);
    this.getBrandTop();
  }

  getProductNoiBat(idBrand: number) {
    this.productService.getProductNoiBatByBrand(idBrand).subscribe(res => {
      this.listProductNoiBat = res;
    }, error => {
      console.log(error.error);
    });
  }

  getBrandTop() {
    this.brandService.getBrandTop().subscribe(res => {
      this.listBrand = res;
    });
  }

  changeBrand(idBrand: number) {
    this.getProductNoiBat(idBrand);
    this.cdr.detectChanges();
  }
}
