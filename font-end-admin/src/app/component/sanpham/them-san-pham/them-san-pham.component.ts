import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrandService } from '../../../service/brand.service';
import { CategoryInterface } from '../../../interface/category-interface';
import { CategoryService } from '../../../service/category.service';
import { BrandInterface } from '../../../interface/brand-interface';
import { SoleService } from '../../../service/sole.service';
import { MaterialpostService } from '../../../service/materialpost.service';
import { SoleInterface } from '../../../interface/sole-interface';
import { MaterialInterface } from '../../../interface/material-interface';
import { CommonFunction } from '../../../util/common-function';
import { ValidateInput } from '../../model/validate-input';
import Swal from 'sweetalert2';
import { MausacService } from '../../../service/mausac.service';
import { SizeService } from '../../../service/size.service';
import { SizeInterface } from '../../../interface/size-interface';
import { ColorInterface } from '../../../interface/color-interface';
import { ToastrService } from 'ngx-toastr';
import QRCode from 'qrcode'; // Import thư viện QRCode
import { ProductdetailService } from 'src/app/service/productdetail.service';

@Component({
  selector: 'app-them-san-pham',
  templateUrl: './them-san-pham.component.html',
  styleUrls: ['./them-san-pham.component.css']
})

export class ThemSanPhamComponent implements OnInit {
  rowData = [];

  image: File | null = null;
  validImage: ValidateInput = new ValidateInput();

  Name: string;
  validName: ValidateInput = new ValidateInput();

  Price: number;
  validPrice: ValidateInput = new ValidateInput();
  featureEnabled: boolean = true;

  Description: string;
  validDescription: ValidateInput = new ValidateInput();

  Status: number = 0;

  category: CategoryInterface[] = [];
  IdCategory: number;
  validCategory: ValidateInput = new ValidateInput();

  brand: BrandInterface[] = [];
  IdBrand: number;
  validBrand: ValidateInput = new ValidateInput();

  sole: SoleInterface[] = [];
  IdSole: number;
  validSole: ValidateInput = new ValidateInput();

  material: MaterialInterface[] = [];
  IdMaterial: number;
  validMaterial: ValidateInput = new ValidateInput();

  size: SizeInterface[] = [];
  idSize: number[];
  listSizeChoice = [];

  color: ColorInterface[] = [];
  idColor: number[];
  listColorChoice = [];


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

  quantity: number;

  imageList: File;

  productDetail = [];

  jsonCurrent = {
    idProduct: null,
    idColor: null,
    idSize: null
  }

  nameQR: string;

  constructor(
    private productService: ProductService,
    private productDetailService: ProductdetailService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private soleService: SoleService,
    private materialService: MaterialpostService,
    private colorService: MausacService,
    private toastr: ToastrService,
    private sizeService: SizeService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ThemSanPhamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.getAllBrand();
    this.getAllCategory();
    this.getAllMaterial();
    this.getAllSole();
    this.getAllColor();
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

  getAllBrand() {
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

  OnChangeFile(event: any) {
    this.imageList = event.target.files[0];
  }

  clickadd() {
    this.Name = CommonFunction.trimText(this.Name);
    this.validateName();

    this.Description = CommonFunction.trimText(this.Description);
    this.validateDescription();

    this.validateBrand();
    this.validateCategory();
    this.validateSole();
    this.validateMaterial();
    this.validateImage();

    if (!this.validName.done || !this.validDescription.done || !this.validBrand
      || !this.validCategory.done || !this.validSole.done || !this.validMaterial.done
      || !this.validImage.done
    ) {
      return;
    }

    if (this.productDetail.some(c => c.quantity === null || c.quantity === '')) {
      this.toastr.error('Vui lòng nhập đủ số lượng', 'Lỗi nhập liệu');
      return;
    }

    if (this.productDetail.some(c => c.price === null || c.price === '')) {
      this.toastr.error('Vui lòng nhập giá tiền', 'Lỗi nhập liệu');
      return;
    }

    Swal.fire({
      title: 'Bạn muốn thêm',
      text: 'Thao tác này sẽ không hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#dd3333',
      confirmButtonText: 'Thêm',
      cancelButtonText: 'Thoát'
    }).then((result1) => {
      if (result1.isConfirmed) {
        const products = {
          name: this.Name,
          idBrand: this.IdBrand,
          idCategory: this.IdCategory,
          idMaterial: this.IdMaterial,
          idSole: this.IdSole,
          description: this.Description,
          status: this.Status,
          productDetailAdminDTOList: this.productDetail
        }

        this.productService.CreateProduct(products).subscribe(
          result => {
            result.data.productDetailList.forEach((detail: { id: any; }) => {
              this.productDetailService.getAllProductDetail().subscribe(
                (res) => {
                  const filteredDetails = res.filter((item: any) => item.id === detail.id);
                  const firstItem = filteredDetails[0];

                  if (firstItem) {
                    this.nameQR = `${firstItem.productDTO.name} - ${firstItem.colorDTO.name} - ${firstItem.sizeDTO.sizeNumber}`;
                    const qrData = String(detail.id);
                    QRCode.toDataURL(qrData, { width: 256 }, (err: any, url: string) => {
                      if (err) {
                        this.toastr.error('Đã xảy ra lỗi khi tạo QR', err);
                        return;
                      }

                      // Create and download the QR code image
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${this.nameQR}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    });
                  } else {
                    this.toastr.error('Không tìm thấy chi tiết sản phẩm', 'Thông báo');
                  }
                },
                (error) => {
                  this.toastr.error('Đã xảy ra lỗi khi lấy thông tin chi tiết sản phẩm', 'Thông báo');
                }
              );
            });

            this.productService.uploadImgProduct(this.imageList, result.data.id).subscribe(
              rsss => {
                this.dialogRef.close('addProduct');
              }
            );
          },
          error => {
            this.toastr.error('Lỗi khi tạo sản phẩm.', 'Thông báo');
          }
        );

        Swal.fire({
          title: 'Thêm',
          text: 'Thêm thành công',
          icon: 'success'
        });
      }
    })
  }

  revoveInvalid(result: ValidateInput) {
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
    this.validPrice = CommonFunction.validateInput(this.Price, 250, '^[0-9]');
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
    this.validImage = CommonFunction.validateInput(this.imageList, 250, null);
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
