import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {ProductService} from '../../../service/product.service';
import {BrandService} from '../../../service/brand.service';
import {CategoryInterface} from '../../../interface/category-interface';
import {CategoryService} from '../../../service/category.service';
import {BrandInterface} from '../../../interface/brand-interface';
import {SoleService} from '../../../service/sole.service';
import {MaterialpostService} from '../../../service/materialpost.service';
import {SoleInterface} from '../../../interface/sole-interface';
import {MaterialInterface} from '../../../interface/material-interface';
import {Router} from '@angular/router';
import {CommonFunction} from '../../../util/common-function';
import {ValidateInput} from '../../model/validate-input';
import {ImageService} from '../../../service/image.service';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import {ProductdetailService} from '../../../service/productdetail.service';
import {MausacService} from '../../../service/mausac.service';
import {SizeService} from '../../../service/size.service';
import {SizeInterface} from '../../../interface/size-interface';
import {ColorInterface} from '../../../interface/color-interface';
import {FormControl} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-them-san-pham',
  templateUrl: './them-san-pham.component.html',
  styleUrls: ['./them-san-pham.component.css']
})
export class ThemSanPhamComponent implements OnInit {
  image: File | null = null;
  validName: ValidateInput = new ValidateInput();
  validBrand: ValidateInput = new ValidateInput();
  validCategory: ValidateInput = new ValidateInput();
  validSole: ValidateInput = new ValidateInput();
  validMaterial: ValidateInput = new ValidateInput();
  validPrice: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  validImage: ValidateInput = new ValidateInput();
  rowData = [];
  Code: string;
  Name: string;
  CreateName: string;
  IdBrand: number;
  IdCategory: number;
  IdMaterial: number;
  IdSole: number;
  Price: number;
  Description: string;
  Status: number = 0;
  categories: CategoryInterface[] = [];
  brand: BrandInterface[] = [];
  size: SizeInterface[] = [];
  color: ColorInterface[] = [];
  sole: SoleInterface[] = [];
  material: MaterialInterface[] = [];
  idnv: string;
  imgLst;
  image1;
  lstPrdt;
  idColor: number[];
  idSize: number[];
  shoeCollar: number;
  quantity: number;
  productDetail = [];
  keyword: string;
  listSizeChoice = [];
  listColorChoice = [];
  listShoeCollar = [
    {
      id: 0,
      name: 'Cổ thấp',
    },
    {
      id: 1, name: 'Cổ cao'
    }
  ];

  constructor(private prdsv: ProductService,
              private brsv: BrandService,
              private ctsv: CategoryService,
              private slsv: SoleService,
              private mtsv: MaterialpostService,
              private router: Router,
              private imageService: ImageService,
              private http: HttpClient,
              private prddtsv: ProductdetailService,
              private clsv: MausacService,
              private toaS: ToastrService,
              private szsv: SizeService,
              private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getALLBrand();
    this.getAllCategory();
    this.getAllMaterial();
    this.getAllSole();
    this.getALLColor();
    this.getALLSize();
  }

  getALLSize() {
    this.szsv.getAllSize().subscribe(res => {
      this.size = res;
    });
  }

  getALLColor() {
    this.clsv.getAllMauSac().subscribe(res => {
      this.color = res;
    });
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

  OnChangeFile(event: any) {
    console.log(event);
    this.imgLst = new FormData();
    if (event.target.files.length > 0 && event.target.files.length === 3) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.imgLst.append('file', event.target.files[i]);
      }
    }
    return;
  }
  clickaddProduct() {
    console.log('Chi tieest: ', this.productDetail);
    this.Name = CommonFunction.trimText(this.Name);
    this.Description = CommonFunction.trimText(this.Description);
    this.Price = CommonFunction.trimText(this.Price);
    this.validateName();
    this.validateDescription();
    this.validatePrice();
    this.validateBrand();
    this.validateCategory();
    this.validateSole();
    this.validateMaterial();
    this.validateImage();
    if (!this.validName.done || !this.validDescription.done || !this.validPrice.done || !this.validBrand
      || !this.validCategory.done || !this.validSole.done || !this.validMaterial.done
      || !this.validImage.done
    ) {
      return;
    }
    if (this.productDetail.some(c => c.quantity === null || c.quantity === '')) {
      this.toaS.error('Vui long nhap day du so luong');
      return;
    }
    Swal.fire({
      title: 'Bạn muốn thêm?',
      text: 'Thao tác này sẽ không hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#dd3333',
      confirmButtonText: 'Thêm!'
    }).then((result1) => {
      if (result1.isConfirmed) {
        this.idnv = localStorage.getItem('id');
        const products = {
          code: this.Code,
          name: this.Name,
          createName: this.CreateName,
          idBrand: this.IdBrand,
          idCategory: this.IdCategory,
          idMaterial: this.IdMaterial,
          idSole: this.IdSole,
          description: this.Description,
          status: this.Status,
          price: this.Price,
          idnv: this.idnv,
          productDetailAdminDTOList: this.productDetail
        };
        console.log(this.productDetail);
        this.prdsv.CreateProduct(products).subscribe(
          result => {
            this.prdsv.uploadImgProduct(this.imgLst, result.data.id).subscribe(res => {
              console.log('đã vào đây');
            });
            this.router.navigate(['admin/san-pham']);
            console.log('Product add success', result);
          },
          error => {
            console.error('Product add error', error);
          }
        );
        Swal.fire({
          title: 'Thêm!',
          text: 'Thêm thành công',
          icon: 'success'
        });
      }
    });
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateImageCount(files: any): boolean {
    return files.length === 3;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.Name, 250, null);
  }

  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.Description, 250, null);
  }

  validatePrice() {
    this.validPrice = CommonFunction.validateInput(this.Price, 250, '^[0-9]+$');
  }

  validateBrand() {
    this.validBrand = CommonFunction.validateInput(this.IdBrand, 250, null);
  }

  validateCategory() {
    this.validCategory = CommonFunction.validateInput(this.IdCategory, 250, null);
  }

  validateSole() {
    this.validSole = CommonFunction.validateInput(this.IdSole, 250, null);
  }

  validateMaterial() {
    this.validMaterial = CommonFunction.validateInput(this.IdMaterial, 250, null);
  }

  validateImage() {
    this.validImage = CommonFunction.validateInput(this.imgLst, 250, null);
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
            name: this.Name,
            sizeDTO: this.listSizeChoice[i],
            colorDTO: this.listColorChoice[j],
            quantity: 1,
            shoeCollar: 0
          };
          this.productDetail.push(obj);
          console.log(obj);
        }
      }
    } else {
      return;
    }
  }

  deleteProductDetail(i: number) {
    //xoas phan tu this.productDetail
    this.productDetail.splice(i, 1);
    this.cdr.detectChanges();
  }
}
