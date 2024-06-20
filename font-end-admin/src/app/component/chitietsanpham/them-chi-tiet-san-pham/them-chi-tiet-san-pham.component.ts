import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductdetailService } from '../../../service/productdetail.service';
import { ProductService } from '../../../service/product.service';
import { MausacService } from '../../../service/mausac.service';
import { SizeService } from '../../../service/size.service';
import { SizeInterface } from '../../../interface/size-interface';
import { ColorInterface } from '../../../interface/color-interface';
import { ProductInterface } from '../../../interface/product-interface';
import { ValidateInput } from '../../model/validate-input';
import { CommonFunction } from '../../../util/common-function';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-them-chi-tiet-san-pham',
  templateUrl: './them-chi-tiet-san-pham.component.html',
  styleUrls: ['./them-chi-tiet-san-pham.component.css']
})

export class ThemChiTietSanPhamComponent implements OnInit {
  IdProduct: number;
  IdColor: number;
  IdSize: number;
  shoeCollar: number = 0;
  quantity: string;
  price: number = 1000;

  size: SizeInterface[] = [];
  color: ColorInterface[] = [];
  product: ProductInterface[] = [];
  rowData = [];

  validQuantity: ValidateInput = new ValidateInput();
  validColor: ValidateInput = new ValidateInput();
  validSize: ValidateInput = new ValidateInput();
  validProduct: ValidateInput = new ValidateInput();
  validPrice: ValidateInput = new ValidateInput();

  constructor(
    public dialogRef: MatDialogRef<ThemChiTietSanPhamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productDetailService: ProductdetailService,
    private productService: ProductService,
    private colorService: MausacService,
    private sizeService: SizeService
  ) { }

  ngOnInit(): void {
    this.getAllColor();
    this.getAllProduct();
    this.getAllSize();
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

  getAllProduct() {
    this.productService.getAllProduct().subscribe(res => {
      this.product = res.filter((product: { status: number; }) => product.status === 0);
    });
  }

  revoveInvalid(result) {
    result.done = true;
  }

  validateQuantity() {
    this.validQuantity = CommonFunction.validateInput(this.quantity, 250, null);
  }

  validateColor() {
    this.validColor = CommonFunction.validateInput(this.IdColor, 250, null);
  }

  validateSize() {
    this.validSize = CommonFunction.validateInput(this.IdSize, 250, null);
  }

  validateProduct() {
    this.validProduct = CommonFunction.validateInput(this.IdProduct, 250, null);
  }

  validatePrice() {
    this.validPrice = CommonFunction.validateInput(this.price.toString(), 250, null);
  }

  clickadd() {
    this.quantity = CommonFunction.trimText(this.quantity);
    this.price = Number(CommonFunction.trimText(this.price.toString()));

    this.validateQuantity();
    this.validateColor();
    this.validateProduct();
    this.validateSize();
    this.validatePrice();

    if (!this.validQuantity.done || !this.validProduct.done || !this.validColor.done || !this.validSize.done || !this.validPrice.done) {
      return;
    }

    Swal.fire({
      title: 'Bạn muốn thêm',
      text: 'Thao tác này sẽ không hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thêm',
      cancelButtonText: 'Thoát',
    }).then((result1) => {
      if (result1.isConfirmed) {
        const productDetail = {
          idProduct: this.IdProduct,
          idColor: this.IdColor,
          idSize: this.IdSize,
          shoeCollar: this.shoeCollar,
          quantity: Number(this.quantity),
          price: this.price,
        };

        this.productDetailService.CreateProductDetail(productDetail).subscribe(
          result => {
            console.log('productDetail add success', result);
            this.dialogRef.close('addProductDetail');
          },
          error => {
            console.error('productDetail add error', error);
          }
        );
        Swal.fire({
          title: 'Thêm',
          text: 'Thêm thành công',
          icon: 'success'
        });
      }
    });
  }

}
