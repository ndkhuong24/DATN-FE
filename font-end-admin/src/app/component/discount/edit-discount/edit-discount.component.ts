import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountService } from 'src/app/service/discount.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {ValidateInput} from "../../model/validate-input";
import {CommonFunction} from "../../../util/common-function";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.css'],
})
export class EditDiscountComponent implements OnInit {
   isHidden = true;
  discount: any = {
    discountAdminDTO: {
      id: '',
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      createName: localStorage.getItem('fullname'),
    },
    spap: '0',
    reducedValue: '',
    discountType: '',
    maxReduced: '',
  };
  checkStartDate: boolean = false;
  checkStartDateNull = false;
  checkEndDate: boolean = false;
  checkEndDateNull = false;
  validName: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  validReducedValue: ValidateInput = new ValidateInput();
  validMaxReduced: ValidateInput = new ValidateInput();
  gridApi: any;
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  disableCheckPriceProduct = false;
  iđStaff = '';

  constructor(private discountService: DiscountService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastrService,
              private datePipe: DatePipe) {
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
  currentDate: Date = new Date();
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  ngOnInit(): void {
    this.discountService.getProduct().subscribe((response) => {
      this.rowData = response;
      console.log(response);
    });
    this.isHidden = true;
    // Lấy thông tin khuyến mãi dựa trên id từ tham số URL
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      this.discountService
        .getDetailDiscount(id)
        .subscribe((response: any[]) => {
          const firstDiscount = Array.isArray(response) ? response[0] : response;
          this.discount.discountAdminDTO.id = firstDiscount.id;
          this.discount.discountAdminDTO.name =
            firstDiscount.name;
          this.discount.discountAdminDTO.startDate =
            this.formatDate(firstDiscount.startDate);
          this.discount.discountAdminDTO.endDate =
            this.formatDate(firstDiscount.endDate);
          this.discount.discountAdminDTO.description =
            firstDiscount.description;
          this.discount.reducedValue = firstDiscount.reducedValue;
          this.discount.discountType = firstDiscount.discountType;
          this.discount.maxReduced = firstDiscount.maxReduced;

          console.log(this.discount);
        });
    });
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
  // Phương thức cập nhật thông tin khuyến mãi
  editDiscount() {
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
        if (this.discount.reducedValue > arrayProduct[i].price && this.discount.discountType === 0 ) {
          console.log('Array Product:', arrayProduct);
          console.log('Discount:', this.discount);
          this.disableCheckPriceProduct = true;
          this.toastr.error('Giá trị giảm lớn hơn giá sản phẩm');
          return;
        }
      }
    }
    Swal.fire({
      title: 'Bạn có muốn sửa giảm giá không?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sửa'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.disableCheckPriceProduct === false) {
          this.iđStaff = localStorage.getItem('idStaff');
          const obj = {
            ...this.discount,
            productDTOList: arrayProduct,
          };
          this.discountService.updateDiscount(this.discount.discountAdminDTO.id, obj).subscribe(
            (response) => {
              // Handle the response if needed, e.g., show a success message
              console.log('Discount added successfully', response);
              this.router.navigateByUrl('/admin/discount');
            },
            (error) => {
              // Handle errors if the discount creation fails
              this.toastr.error('Sửa giảm giá thất bại');
              console.error('Error adding discount', error);
            }
          );
        }
        Swal.fire({
          title: 'Sửa giảm giá thành công!',
          icon: 'success'
        });
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
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm') || '';
  }}
