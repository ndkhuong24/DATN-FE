import {Component, OnInit, ViewChild} from '@angular/core';
import {NgModule} from '@angular/core';
import {DiscountService} from '../../../service/discount.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import Swal from 'sweetalert2';
import {ValidateInput} from "../../model/validate-input";
import {UtilService} from "../../../util/util.service";
import {CommonFunction} from "../../../util/common-function";

@Component({
  selector: 'app-creat-discount',
  templateUrl: './creat-discount.component.html',
  styleUrls: ['./creat-discount.component.css'],
})
export class CreatDiscountComponent implements OnInit {
  discount: any = {
    discountAdminDTO: {
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      createName: localStorage.getItem('fullname'),
    },
    spap: '0',
    reducedValue: '',
    discountType: 0,
    maxReduced: 0,
    productDTOList: [],
  };
  checkStartDate: boolean = false;
  checkStartDateNull = false;
  checkEndDate: boolean = false;
  checkEndDateNull = false;
  currentDate: Date = new Date();
  fullname = '';
  gridApi: any;
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  disableCheckPriceProduct = false;
  iđStaff = '';
  validName: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  validReducedValue: ValidateInput = new ValidateInput();
  validMaxReduced: ValidateInput = new ValidateInput();
  constructor(private discountService: DiscountService,
              private router: Router,
              private toastr: ToastrService, private utilService: UtilService) {
    this.columnDefs = [
      {
        headerName: 'Mã sản phẩm',
        field: 'code',
        sortable: true,
        filter: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: true,
      },
      {
        headerName: 'Tên sản phẩm',
        field: 'name',
        sortable: true,
        filter: true,
        editable: true,
      },
      {
        headerName: 'Tên thương hiệu',
        field: 'brandAdminDTO.name',
        sortable: true,
        filter: true,
        editable: true,
      },
      {
        headerName: 'Loại',
        field: 'categoryAdminDTO.name',
        sortable: true,
        filter: true,
        editable: true,
      },
      {
        headerName: 'Giá',
        field: 'price',
        sortable: true,
        filter: true,
        editable: true,
      },
      {
        headerName: 'Số lượt bán',
        field: 'totalQuantity',
        sortable: true,
        filter: true,
        editable: true,
      },
    ];
  }
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  ngOnInit(): void {
    this.discountService.getProduct().subscribe((response) => {
      this.rowData = response;
      console.log(response);
    });
    console.log(this.currentDate);
  }
  isEndDateValid() {
    this.checkEndDateNull = false;
    if (this.discount.discountAdminDTO.endDate === '' || this.discount.discountAdminDTO.endDate === null
      || this.discount.discountAdminDTO.endDate === undefined){
      this.checkEndDateNull = true;
      this.checkEndDate = false;
      return;
    }
    if (
      this.discount.discountAdminDTO.startDate &&
      this.discount.discountAdminDTO.endDate &&
      this.discount.discountAdminDTO.startDate >= this.discount.discountAdminDTO.endDate
    ) {
      this.checkEndDateNull = false;
      this.checkEndDate = true;
      return;
    }
    this.checkEndDate = false;
    this.checkEndDateNull = false;
  }
  isStartDateValid() {
    this.checkStartDateNull = false;
    const date = new Date();
    if (this.discount.discountAdminDTO.startDate === '' || this.discount.discountAdminDTO.startDate === null
      || this.discount.discountAdminDTO.startDate === undefined){
      this.checkStartDateNull = true;
      this.checkStartDate = false;
      return;
    }
    if (new Date(this.discount.discountAdminDTO.startDate).getTime() < date.getTime()){
      this.checkStartDate = true;
      this.checkStartDateNull = false;
      return;
    }
    this.checkStartDateNull = false;
    this.checkStartDate = false;
  }
  removeCheckStartDate(){
    this.checkStartDateNull = false;
    this.checkStartDate = false;
  }
  removeCheckEndDate(){
    this.checkEndDateNull = false;
    this.checkEndDate = false;
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  addDiscount() {
    this.isEndDateValid();
    this.isStartDateValid();
    this.validateName();
    this.validateReducedValue();
    this.validateDescription();
    this.validateMaxReducedValue();
    if (!this.validName.done || !this.validDescription.done ||
        !this.validReducedValue.done ||
        this.checkStartDate || this.checkStartDateNull || this.checkEndDate || this.checkEndDateNull ) {
      return;
    }
    if (this.discount.discountType === 1 && !this.validMaxReduced.done){
      return;
    }
    const arrayProduct = this.discount.spap === '0' ? this.rowData : this.gridApi.getSelectedRows();
    this.disableCheckPriceProduct = false;
    if (arrayProduct.length <= 0) {
      this.disableCheckPriceProduct = true;
      this.toastr.error('Không có sản phẩm để giảm');
      return;
    }else{
      for (let i = 0; i < arrayProduct.length; i++) {
        if (this.discount.reducedValue > arrayProduct[i].price && this.discount.discountType === 0) {
          console.log('Array Product:', arrayProduct);
          console.log('Discount:', this.discount);
          this.disableCheckPriceProduct = true;
          this.toastr.error('Giá trị giảm lớn hơn giá sản phẩm');
          return;
        }
      }
    }
    Swal.fire({
      title: 'Bạn có muốn thêm giảm giá không?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thêm'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.disableCheckPriceProduct === false) {
          this.iđStaff = localStorage.getItem('idStaff');
          const obj = {
            ...this.discount,
            productDTOList: arrayProduct,
          };

          this.discountService.createDiscount(obj).subscribe(
            (response) => {
              console.log('Discount added successfully', response);
              this.router.navigateByUrl('/admin/discount');
              Swal.fire({
                title: 'Thêm giảm giá thành công!',
                icon: 'success'
              });
            },
            (error) => {
              // Handle errors if the discount creation fails
              this.toastr.error('Thêm giảm giá thất bại');
              console.error('Error adding discount', error);
            }
          );
        }
      }
    });
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateName() {
    this.validName = CommonFunction.validateInput(this.discount.discountAdminDTO.name, 50, null );
  }
  validateDescription() {this.validDescription = CommonFunction.validateInput(this.discount.discountAdminDTO.description, 50, null );
  }
  validateReducedValue() {
    this.validReducedValue = CommonFunction.validateInput(this.discount.reducedValue, 250, /^[1-9]\d*(\.\d+)?$/);
  }
  validateMaxReducedValue() {
      this.validMaxReduced = CommonFunction.validateInput(this.discount.maxReduced, 250, /^[1-9]\d*(\.\d+)?$/);
    }


  }
