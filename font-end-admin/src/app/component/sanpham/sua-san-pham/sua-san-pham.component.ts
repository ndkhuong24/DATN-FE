import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
import { SizeService } from 'src/app/service/size.service';
import { MausacService } from 'src/app/service/mausac.service';
import { SizeInterface } from 'src/app/interface/size-interface';
import { ColorInterface } from 'src/app/interface/color-interface';

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
    // imageList: null,
  };

  imageList: File = null;

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

  size: SizeInterface[] = [];
  idSize: number[];
  listSizeChoice = [];

  color: ColorInterface[] = [];
  idColor: number[];
  listColorChoice = [];

  productDetail = [];

  shoeCollar: number;
  listShoeCollar = [
    {
      id: 0,
      name: 'Cổ thấp',
    },
    {
      id: 1,
      name: 'Cổ cao'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<SuaSanPhamComponent>,
    @Inject(MAT_DIALOG_DATA) public products: any,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private soleService: SoleService,
    private materialService: MaterialpostService,
    private sizeService: SizeService,
    private colorService: MausacService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    console.log(this.products);

    this.getALLBrand();
    this.getAllCategory();
    this.getAllMaterial();
    this.getAllSole();
    this.getAllColor();
    this.getAllSize();
    this.productDetail = this.products.productDetailAdminDTOList;
    this.zenProductDetail1();
  }

  zenProductDetail1() {
    if (this.listColorChoice.length > 0 && this.listSizeChoice.length > 0) {
      for (let i = 0; i < this.listSizeChoice.length; i++) {
        for (let j = 0; j < this.listColorChoice.length; j++) {
          const obj = {
            sizeDTO: this.listSizeChoice[i],
            colorDTO: this.listColorChoice[j],
            quantity: 1,
            shoeCollar: 0,
            price: 1000,
          };
          this.productDetail.push(obj);
        }
      }
    } else {
      return;
    }
  }

  getAllSize() {
    this.sizeService.getAllSize().subscribe(res => {
      this.size = res.filter((size: { status: number; }) => size.status === 0);
    });
  }

  getAllColor() {
    this.colorService.getAllMauSac().subscribe(res => {
      this.color = res.filter((color: { status: number; }) => color.status === 0);
    });
  }

  OnChangeFile(event: any) {
    this.imageList = event.target.files[0];
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
        if (this.imageList === null) {
          const product = {
            code: this.product.code,
            name: this.product.name,
            idBrand: this.product.idBrand,
            idMaterial: this.product.idMaterial,
            idSole: this.product.idSole,
            idCategory: this.product.idCategory,
            description: this.product.description,
            status: this.product.status,
            productDetailAdminDTOList: this.productDetail,
          };

          this.productService.UpdateProduct(id, product).subscribe(
            result => {
              this.dialogRef.close('saveProduct');
            },
            error => {
              console.error('product add error', error);
            }
          );
          Swal.fire('Sửa', 'Sửa thành công', 'success');
        } else {
          this.productService.updateImgProduct(this.imageList, id).subscribe((res) => {
            if (res.ok) {
              const productCurrent = {
                code: this.product.code,
                name: this.product.name,
                idBrand: this.product.idBrand,
                idMaterial: this.product.idMaterial,
                idSole: this.product.idSole,
                idCategory: this.product.idCategory,
                description: this.product.description,
                status: this.product.status,
                productDetailAdminDTOList: this.productDetail,
              };

              this.productService.UpdateProduct(id, productCurrent).subscribe(
                result => {
                  this.dialogRef.close('saveProduct');
                },
                error => {
                  console.error('product add error', error);
                }
              );
              Swal.fire('Sửa', 'Sửa thành công', 'success');
            }
            else {
              Swal.fire('Error', 'Failed to update image', 'error');
            }
          })
        }
      }
    })
  }

  OnChangSize(event: any[]) {
    this.listSizeChoice = [];
    this.listSizeChoice = event;
    this.zenProductDetail();
  }

  OnChangColor(event: any[]) {
    this.listColorChoice = [];
    this.listColorChoice = event;
    this.zenProductDetail();
  }

  zenProductDetail() {
    this.productDetail = [];
    if (this.listColorChoice.length > 0 && this.listSizeChoice.length > 0) {
      for (let i = 0; i < this.listSizeChoice.length; i++) {
        for (let j = 0; j < this.listColorChoice.length; j++) {
          const obj = {
            sizeDTO: this.listSizeChoice[i],
            colorDTO: this.listColorChoice[j],
            quantity: 1,
            shoeCollar: 0,
            price: 1000,
            idProduct: this.products.id,
            idColor: this.listColorChoice[j].id,
            idSize: this.listSizeChoice[i].id,
          };
          this.productDetail.push(obj);
        }
      }
    } else {
      return;
    }
  }

  deleteProductDetail(i: number) {
    this.productDetail.splice(i, 1);
    this.cdr.detectChanges();
  }

  // preventNegative(event: any) {
  //   if (event.target.value < 1) {
  //     event.target.value = 1;
  //   }
  // }

  preventNegative(event: any) {
    let value = event.target.value;

    // Regular expression to match positive integers
    const positiveIntegerRegex = /^[1-9]\d*$/;

    if (!positiveIntegerRegex.test(value)) {
      value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      value = value.replace(/^0+/, ''); // Remove leading zeros

      if (value === '' || value === '0') {
        value = '1'; // Default to 1 if the input is invalid
      }

      event.target.value = value;
    }
  }
}
