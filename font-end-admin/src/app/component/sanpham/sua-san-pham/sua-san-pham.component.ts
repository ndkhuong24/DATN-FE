import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProductService} from '../../../service/product.service';
import {BrandService} from '../../../service/brand.service';
import {CategoryService} from '../../../service/category.service';
import {SoleService} from '../../../service/sole.service';
import {MaterialpostService} from '../../../service/materialpost.service';
import {CategoryInterface} from '../../../interface/category-interface';
import {BrandInterface} from '../../../interface/brand-interface';
import {SoleInterface} from '../../../interface/sole-interface';
import {MaterialInterface} from '../../../interface/material-interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sua-san-pham',
  templateUrl: './sua-san-pham.component.html',
  styleUrls: ['./sua-san-pham.component.css']
})
export class SuaSanPhamComponent implements OnInit {
  product: any = {
    code: null,
    name: null,
    idBrand: null,
    idCategory: null,
    idMaterial: null,
    description: null,
    status: null,
    idSole: null,
    price: null,
  };
  idProduct: any;
  categories: CategoryInterface[] = [];
  brand: BrandInterface[] = [];
  sole: SoleInterface[] = [];
  material: MaterialInterface[] = [];
  rowData = [];
  data: any;
  validName: ValidateInput = new ValidateInput();
  validBrand: ValidateInput = new ValidateInput();
  validCategory: ValidateInput = new ValidateInput();
  validSole: ValidateInput = new ValidateInput();
  validMaterial: ValidateInput = new ValidateInput();
  validPrice: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  constructor(private prdsv: ProductService,
              private brsv: BrandService,
              private ctsv: CategoryService,
              private slsv: SoleService,
              private mtsv: MaterialpostService, private router: Router,
              private route: ActivatedRoute) {
    this.idProduct = +this.route.snapshot.paramMap.get('idProduct');
  }

  ngOnInit(): void {
    this.getALLBrand();
    this.getAllCategory();
    this.getAllMaterial();
    this.getAllSole();
    this.getProductDetails(this.idProduct);
    console.log('data', this.product.code);
  }

  getProductDetails(productId: number): void {
    this.prdsv.GetProduct(productId).subscribe((result) => {
        this.product.code = result.data.code;
        this.product.name = result.data.name;
        this.product.idBrand = result.data.idBrand;
        this.product.idCategory = result.data.idCategory;
        this.product.idMaterial = result.data.idMaterial;
        this.product.idSole = result.data.idSole;
        this.product.description = result.data.description;
        this.product.price = result.data.price;
        this.product.status = result.data.status;
        console.log(this.product.code);
        console.log(result.data.code);
      },
      error => {
        console.error('Error retrieving product details:', error);
      }
    );
  }

  getALLBrand() {
    this.brsv.getAllBrand().subscribe(res => {
      this.brand = res;
    });
  }

  getAllCategory() {
    this.ctsv.getAllCategory().subscribe(res => {
      this.categories = res;
    });
  }

  getAllSole() {
    this.slsv.getAllSole().subscribe(res => {
      this.sole = res;
    });
  }

  getAllMaterial() {
    this.mtsv.getAllMaterial().subscribe(res => {
      this.material = res;
    });
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.product.name, 250, null);
  }
  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.product.description, 250, null);
  }
  validatePrice() {
    this.validPrice = CommonFunction.validateInput(this.product.price, 250, null);
  }
  validateBrand() {
    this.validBrand = CommonFunction.validateInput(this.product.idBrand, 250, null);
  }
  validateCategory() {
    this.validCategory = CommonFunction.validateInput(this.product.idCategory, 250, null);
  }
  validateSole() {
    this.validSole = CommonFunction.validateInput(this.product.idSole, 250, null);
  }
  validateMaterial() {
    this.validMaterial = CommonFunction.validateInput(this.product.idMaterial, 250, null);
  }

  clickUpdate(id: number) {
    this.product.name = CommonFunction.trimText(this.product.name);
    this.product.description = CommonFunction.trimText(this.product.description);
    this.product.price = CommonFunction.trimText(this.product.price);
    this.validateName();
    this.validateDescription();
    this.validatePrice();
    this.validateBrand();
    this.validateCategory();
    this.validateSole();
    this.validateMaterial();
    if (!this.validName.done || !this.validDescription.done || !this.validPrice.done || !this.validBrand
    || !this.validCategory.done || !this.validSole.done || !this.validMaterial.done) {
      return;
    }
    Swal.fire({
      title: 'Bạn chắc muốn sửa?',
      text: 'Bạn sẽ không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sửa!'
    }).then((result1) => {
      if (result1.isConfirmed) {
    const product = {
      code: this.product.code,
      name: this.product.name,
      idBrand: this.product.idBrand,
      idMaterial: this.product.idMaterial,
      idSole: this.product.idSole,
      idCategory: this.product.idCategory,
      description: this.product.description,
      status: this.product.status,
      price: this.product.price
    };
    this.prdsv.UpdateProduct(id, product).subscribe(
      result => {
        console.log('product add success', result);
        this.router.navigateByUrl('admin/san-pham');
      },
      error => {
        console.error('product add error', error);
      }
    );
    Swal.fire(
          'Sửa!',
          'Sửa thành công',
          'success'
        );
      }
    });
  }

}
