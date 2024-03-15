import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/product.service';
import {UtilService} from '../../util/util.service';
import {CookieService} from 'ngx-cookie-service';
import {CartService} from '../../service/cart.service';
import {BrandService} from '../../service/brand.service';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];
@Component({
  selector: 'app-sanpham',
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent implements OnInit {

  cartData = new Map();
  constructor(private productService: ProductService , public utilService: UtilService,
              private cookieService: CookieService, private cartService: CartService, private brandService: BrandService,
              private cdr: ChangeDetectorRef
  ) {

    if (this.cookieService.check('cart')) {
      this.cookieService.delete('checkout');
      const cartData = this.cookieService.get('cart');
      const entries = JSON.parse(cartData);
      this.cartData = new Map(entries);
      this.cartService.updateTotalProducts(this.cartData.size);
    }
    this.dataSource.data = TREE_DATA;
  }

  listProductNoiBat = [];
  listBrand = [];
  idBrand: number = null;
  isMouseOver: { [key: number]: boolean } = {};

  ngOnInit(): void {
    this.getProductNoiBat(0);
    this.getBrandTop();
  }

  getProductNoiBat(idBrand){
    this.productService.getProductNoiBatByBrand(idBrand).subscribe(res => {
      this.listProductNoiBat = res;
      console.log('Data => ', this.listProductNoiBat);
    }, error => {
      console.log(error.error);
    });
  }

  getBrandTop(){
    this.brandService.getBrandTop().subscribe(res => {
      this.listBrand = res;
      console.log('DataBrand => ', this.listBrand);
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

  changeBrand(id) {
    this.getProductNoiBat(id);
    this.cdr.detectChanges();
  }
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
