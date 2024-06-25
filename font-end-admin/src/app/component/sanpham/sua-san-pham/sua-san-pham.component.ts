import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../service/product.service';
import { BrandService } from '../../../service/brand.service';
import { CategoryService } from '../../../service/category.service';
import { SoleService } from '../../../service/sole.service';
import { MaterialpostService } from '../../../service/materialpost.service';
import { CategoryInterface } from '../../../interface/category-interface';
import { BrandInterface } from '../../../interface/brand-interface';
import { SoleInterface } from '../../../interface/sole-interface';
import { MaterialInterface } from '../../../interface/material-interface';
import { ValidateInput } from '../../model/validate-input';
import { CommonFunction } from '../../../util/common-function';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sua-san-pham',
  templateUrl: './sua-san-pham.component.html',
  styleUrls: ['./sua-san-pham.component.css']
})

export class SuaSanPhamComponent implements OnInit {
  product: any = {
    name: null,
    idBrand: null,
    idSole: null,
    idCategory: null,
    idMaterial: null,
    description: null,
    status: null,
    imageList: null,
  };

  category: CategoryInterface[] = [];
  brand: BrandInterface[] = [];
  sole: SoleInterface[] = [];
  material: MaterialInterface[] = [];

  validName: ValidateInput = new ValidateInput();
  validBrand: ValidateInput = new ValidateInput();
  validCategory: ValidateInput = new ValidateInput();
  validSole: ValidateInput = new ValidateInput();
  validMaterial: ValidateInput = new ValidateInput();
  validPrice: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();

  constructor(
    public dialogRef: MatDialogRef<SuaSanPhamComponent>,
    @Inject(MAT_DIALOG_DATA) public products: any,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private soleService: SoleService,
    private materialService: MaterialpostService,
  ) { }

  ngOnInit(): void {
    this.getALLBrand();
    this.getAllCategory();
    this.getAllMaterial();
    this.getAllSole();
  }

  OnChangeFile(event: any) {
    this.product.imageList = event.target.files[0];
  }

  getALLBrand() {
    this.brandService.getAllBrand().subscribe(res => {
      this.brand = res.filter((brand: { status: number; }) => brand.status === 0);
    });
  }

  getAllCategory() {
    this.categoryService.getAllCategory().subscribe(res => {
      this.category = res.filter((category: { status: number; }) => category.status === 0);
    });
  }

  getAllSole() {
    this.soleService.getAllSole().subscribe(res => {
      this.sole = res.filter((sole: { status: number; }) => sole.status === 0);
    });
  }

  getAllMaterial() {
    this.materialService.getAllMaterial().subscribe(res => {
      this.material = res.filter((material: { status: number; }) => material.status === 0);
    });
  }

  revoveInvalid(result: { done: boolean; }) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.products.name, 250, null);
  }

  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.products.description, 250, null);
  }

  validateBrand() {
    this.validBrand = CommonFunction.validateInput(this.products.idBrand, 250, null);
  }

  validateCategory() {
    this.validCategory = CommonFunction.validateInput(this.products.idCategory, 250, null);
  }

  validateSole() {
    this.validSole = CommonFunction.validateInput(this.products.idSole, 250, null);
  }

  validateMaterial() {
    this.validMaterial = CommonFunction.validateInput(this.products.idMaterial, 250, null);
  }

  clickUpdate(id: number) {
    this.product.name = CommonFunction.trimText(this.products.name);
    this.product.description = CommonFunction.trimText(this.products.description);
    this.product.status = this.products.status;
    this.product.idBrand = this.products.idBrand;
    this.product.idSole = this.products.idSole;
    this.product.idMaterial = this.products.idMaterial;
    this.product.idCategory = this.products.idCategory;

    this.validateName();
    this.validateDescription();
    this.validateBrand();
    this.validateCategory();
    this.validateSole();
    this.validateMaterial();

    if (!this.validName.done || !this.validDescription.done || !this.validBrand
      || !this.validCategory.done || !this.validSole.done || !this.validMaterial.done) {
      return;
    }
    Swal.fire({
      title: 'Bạn chắc muốn sửa',
      text: 'Bạn sẽ không thể hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sửa',
      cancelButtonText: 'Thoát',
    }).then((result1) => {
      if (result1.isConfirmed) {
        if (this.product.imageList === null) {
          const product = {
            code: this.product.code,
            name: this.product.name,
            idBrand: this.product.idBrand,
            idMaterial: this.product.idMaterial,
            idSole: this.product.idSole,
            idCategory: this.product.idCategory,
            description: this.product.description,
            status: this.product.status,
          };

          this.productService.UpdateProduct(id, product).subscribe(
            result => {
              console.log('product add success', result);
              this.dialogRef.close('saveProduct');
            },
            error => {
              console.error('product add error', error);
            }
          );
          Swal.fire(
            'Sửa',
            'Sửa thành công',
            'success'
          );
        } else {
          this.productService.updateImgProduct(this.product.imageList, id).subscribe((res) => {
            if (res.status === 200) {
              const product = {
                code: this.product.code,
                name: this.product.name,
                idBrand: this.product.idBrand,
                idMaterial: this.product.idMaterial,
                idSole: this.product.idSole,
                idCategory: this.product.idCategory,
                description: this.product.description,
                status: this.product.status,
              };

              this.productService.UpdateProduct(id, product).subscribe(
                result => {
                  console.log('product add success', result);
                  this.dialogRef.close('saveProduct');
                },
                error => {
                  console.error('product add error', error);
                }
              );
              Swal.fire(
                'Sửa',
                'Sửa thành công',
                'success'
              );
            } else {
              Swal.fire('Error', 'Failed to update image', 'error');
            }
          })


        }
      }
    })



    // this.product.name = CommonFunction.trimText(this.product.name);
    // this.product.description = CommonFunction.trimText(this.product.description);
    // this.product.price = CommonFunction.trimText(this.product.price);
    // this.validateName();
    // this.validateDescription();
    // this.validatePrice();
    // this.validateBrand();
    // this.validateCategory();
    // this.validateSole();
    // this.validateMaterial();
    // if (!this.validName.done || !this.validDescription.done || !this.validPrice.done || !this.validBrand
    //   || !this.validCategory.done || !this.validSole.done || !this.validMaterial.done) {
    //   return;
    // }
    // Swal.fire({
    //   title: 'Bạn chắc muốn sửa?',
    //   text: 'Bạn sẽ không thể hoàn tác!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Sửa!'
    // }).then((result1) => {
    //   if (result1.isConfirmed) {
    //     const product = {
    //       code: this.product.code,
    //       name: this.product.name,
    //       idBrand: this.product.idBrand,
    //       idMaterial: this.product.idMaterial,
    //       idSole: this.product.idSole,
    //       idCategory: this.product.idCategory,
    //       description: this.product.description,
    //       status: this.product.status,
    //       price: this.product.price
    //     };
    //     this.prdsv.UpdateProduct(id, product).subscribe(
    //       result => {
    //         console.log('product add success', result);
    //         this.router.navigateByUrl('admin/san-pham');
    //       },
    //       error => {
    //         console.error('product add error', error);
    //       }
    //     );
    //     Swal.fire(
    //       'Sửa!',
    //       'Sửa thành công',
    //       'success'
    //     );
    //   }
    // });
  }
}
