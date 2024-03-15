import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CategoryService} from '../../../service/category.service';
import {ProductdetailService} from '../../../service/productdetail.service';
import {ProductService} from '../../../service/product.service';
import {MausacService} from '../../../service/mausac.service';
import {SizeService} from '../../../service/size.service';
import {SizeInterface} from '../../../interface/size-interface';
import {ColorInterface} from '../../../interface/color-interface';
import {ProductInterface} from '../../../interface/product-interface';
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sua-chi-tiet-san-pham',
  templateUrl: './sua-chi-tiet-san-pham.component.html',
  styleUrls: ['./sua-chi-tiet-san-pham.component.css']
})
export class SuaChiTietSanPhamComponent implements OnInit {
  // productDetai: any = {
  //   idColor: null,
  //   idProduct: null,
  //   idSize: null,
  //   quantity : null,
  //   shoeCollar: null,
  // };
  size: SizeInterface[] = [];
  color: ColorInterface[] = [];
  product: ProductInterface[] = [];
  rowData = [];
  validQuantity: ValidateInput = new ValidateInput();
  validColor: ValidateInput = new ValidateInput();
  validSize: ValidateInput = new ValidateInput();
  validProduct: ValidateInput = new ValidateInput();
  constructor(public dialogRef: MatDialogRef<SuaChiTietSanPhamComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private prddtsv: ProductdetailService,
              private prdsv: ProductService,
              private clsv: MausacService,
              private szsv: SizeService) { }

  ngOnInit(): void {
    this.getAllColor();
    this.getAllProduct();
    this.getAllSize();
  }
  getAllSize() {
    this.szsv.getAllSize().subscribe(res => {
      this.size = res;
    });
  }
  getAllColor() {
    this.clsv.getAllMauSac().subscribe(res => {
      this.color = res;
    });
  }
  getAllProduct() {
    this.prdsv.getAllProduct().subscribe(res => {
      this.product = res;
    });
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateQuantity() {
    this.validQuantity = CommonFunction.validateInput(this.data.quantity, 250, null);
  }
  validateColor() {
    this.validColor = CommonFunction.validateInput(this.data.idColor, 250, null);
  }
  validateSize() {
    this.validSize = CommonFunction.validateInput(this.data.idSize, 250, null);
  }
  validateProduct() {
    this.validProduct = CommonFunction.validateInput(this.data.idProduct, 250, null);
  }
  clickUpdate(id: number){
    this.data.quantity = CommonFunction.trimText(this.data.quantity);
    this.validateQuantity();
    this.validateColor();
    this.validateProduct();
    this.validateSize();
    if (!this.validQuantity.done || !this.validProduct.done || !this.validColor.done || !this.validSize.done ) {
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
    const productDetail = {
        idProduct: this.data.idProduct,
        idSize: this.data.idSize,
        idColor: this.data.idColor,
        quantity: this.data.quantity,
        shoeCollar: this.data.shoeCollar
      };
    this.prddtsv.UpdateProductDetail(id, productDetail).subscribe(
        result => {
          console.log('productDetail update success', result);
          this.dialogRef.close('saveProductDetail');
        },
        error => {
          console.error('productDetail add error', error);
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
