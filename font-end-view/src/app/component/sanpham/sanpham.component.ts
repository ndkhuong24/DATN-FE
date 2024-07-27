import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { UtilService } from '../../util/util.service';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../service/cart.service';
import { BrandService } from '../../service/brand.service';
import { ColorService } from '../../service/color.service';
import { SizeService } from '../../service/size.service';
import { CategoryService } from '../../service/category.service';
import { MaterialService } from '../../service/material.service';
import { SoleService } from '../../service/sole.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
// import { log } from 'console';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Fruit loops' },
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli' },
          { name: 'Brussels sprouts' },
        ]
      }, {
        name: 'Orange',
        children: [
          { name: 'Pumpkins' },
          { name: 'Carrots' },
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
  constructor(
    private productService: ProductService,
    public utilService: UtilService,
    private cookieService: CookieService,
    private cartService: CartService,
    private brandService: BrandService,
    private cdr: ChangeDetectorRef,
    private colorService: ColorService,
    private sizeService: SizeService,
    private categoryService: CategoryService,
    private materialService: MaterialService,
    private soleService: SoleService
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
  listBrandT = [];
  listColor = [];
  listSize = [];
  listProductDetail = [];
  listCategory = [];
  listMaterial = [];
  listSole = [];
  listBrand = []
  idBrand: number = null;
  isMouseOver: { [key: number]: boolean } = {};

  ngOnInit(): void {
    this.getProductNoiBat(0);
    this.getBrandTop();
    this.getAlldata();
    this.getAllProduct();
  }

  getProductNoiBat(idBrand) {
    this.productService.getProductNoiBatByBrand(idBrand).subscribe(res => {
      this.listProductNoiBat = res;
      console.log('Data => ', this.listProductNoiBat);
    }, error => {
      console.log(error.error);
    });
  }
  getBrandTop() {
    this.brandService.getBrandTop().subscribe(res => {
      this.listBrandT = res;
      console.log('DataBrand => ', this.listBrandT);
    });
  }

  getAllProduct() {
    this.productService.getAllProduct().subscribe(res => {
      this.listProductDetail = res;
      if (res && Array.isArray(res.data)) {
        this.listProductDetail = res.data
      } else {
        console.error('Fetched data is not an array or does not have a data property:', res);
      }
      // console.log('product', this.listProductDetail);

    })
  }

  getAlldata() {
    this.colorService.getAllColor().subscribe(res => {
      this.listColor = res;
    })
    this.sizeService.getAllSize().subscribe(res => {
      this.listSize = res
    })
    this.brandService.getAllBrand().subscribe(res => {
      this.listBrand = res
    })
    this.categoryService.getAllCategory().subscribe(res => {
      this.listCategory = res
    })
    this.materialService.getAllMaterial().subscribe(res => {
      this.listMaterial = res
    })
    this.soleService.getAllSole().subscribe(res => {
      this.listSole = res
    })
  }
  onMouseEnter(product: any) {
    this.isMouseOver[product.id] = true;
  }

  onMouseLeave(product: any) {
    this.isMouseOver[product.id] = false;
  }

  changeBrand(id) {
    this.getProductNoiBat(id);
    this.cdr.detectChanges();
  }

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  selectedColors: number[] = [];
  selectedSizes: number[] = [];
  selectedBrand: number[] = [];
  selectedCategory: number[] = [];
  selectedMaterial: number[] = [];
  selectedSole: number[] = [];
  minPrice: number | null = null; // Add minPrice
  maxPrice: number | null = null; // Add maxPrice

  onColorChange(id: number, event: any) {
    if (event.target.checked) {
      this.selectedColors.push(id);
    } else {
      this.selectedColors = this.selectedColors.filter(colorId => colorId !== id);
    }
  }

  onSizeChange(id: number, event: any) {
    if (event.target.checked) {
      this.selectedSizes.push(id);
    } else {
      this.selectedSizes = this.selectedSizes.filter(sizeId => sizeId !== id);
    }
  }

  onBrandChange(id: number, event: any) {
    if (event.target.checked) {
      this.selectedBrand.push(id);
    } else {
      this.selectedBrand = this.selectedBrand.filter(brandId => brandId !== id);
    }
  }

  onCategoryChange(id: number, event: any) {
    if (event.target.checked) {
      this.selectedCategory.push(id);
    } else {
      this.selectedCategory = this.selectedCategory.filter(categoryId => categoryId !== id);
    }
  }

  onMaterialChange(id: number, event: any) {
    if (event.target.checked) {
      this.selectedMaterial.push(id);
    } else {
      this.selectedMaterial = this.selectedMaterial.filter(materialId => materialId !== id);
    }
  }

  onSoleChange(id: number, event: any) {
    if (event.target.checked) {
      this.selectedSole.push(id);
    } else {
      this.selectedSole = this.selectedSole.filter(soleId => soleId !== id);
    }
  }

  onMinPriceChange(event: any) {
    this.minPrice = event.target.value ? parseFloat(event.target.value) : null;
  }

  onMaxPriceChange(event: any) {
    this.maxPrice = event.target.value ? parseFloat(event.target.value) : null;
  }

  applyFilter() {
    const filteredProducts = this.listProductDetail.reduce((acc, product) => {
      const matchingDetails = product.productDetailDTOList.filter(detail =>
        (this.selectedColors.length === 0 || this.selectedColors.includes(detail.idColor)) &&
        (this.selectedSizes.length === 0 || this.selectedSizes.includes(detail.idSize)) &&
        (this.minPrice === null || detail.price >= this.minPrice) &&
        (this.maxPrice === null || detail.price <= this.maxPrice)
      );

      // If matching details found, include the whole product with these details
      if (matchingDetails.length > 0 &&
        (this.selectedBrand.length === 0 || this.selectedBrand.includes(product.idBrand)) &&
        (this.selectedCategory.length === 0 || this.selectedCategory.includes(product.idCategory)) &&
        (this.selectedMaterial.length === 0 || this.selectedMaterial.includes(product.idMaterial)) &&
        (this.selectedSole.length === 0 || this.selectedSole.includes(product.idSole))
      ) {
        acc.push({
          ...product,
          productDetailDTOList: matchingDetails
        });
      }

      return acc;
    }, []);

    // console.log('Filtered Products:', filteredProducts);
    this.listProductNoiBat = [];
    this.listProductNoiBat = filteredProducts;
  }
}

