import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VoucherService} from "../../../service/voucher.service";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {ValidateInput} from "../../model/validate-input";
import {CommonFunction} from "../../../util/common-function";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: ['./edit-voucher.component.css'],
})
export class EditVoucherComponent implements OnInit {
   disableCheckLimitCustomer: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private voucherService: VoucherService,
              private router: Router,
              private toastr: ToastrService,
              private datePipe: DatePipe) {
    this.columnDefs = [
      {
        headerName: 'Mã Khách hàng',
        field: 'code',
        sortable: true,
        filter: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: true,
      },
      {
        headerName: 'Tên khách hàng',
        field: 'fullname',
        sortable: true,
        filter: true,
        editable: true,
      },
      {
        headerName: 'Ngày sinh',
        field: 'birthday',
        sortable: true,
        filter: true,
        editable: true,
      },
      {
        headerName: 'Giới tính',
        field: 'gender',
        sortable: true,
        filter: true,
        editable: true,
      },
      {
        headerName: 'Số lượt mua',
        field: 'orderCount',
        sortable: true,
        filter: true,
        editable: true,
      },
    ];
  }
  checkAllow: boolean = false;
  checkStartDate: boolean = false;
  checkStartDateNull = false;
  checkEndDate: boolean = false;
  checkEndDateNull = false;
  isHidden = true;
  gridApi: any;
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  fullname = '';
  check: boolean;
  voucher: any = {
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    reducedValue: '',
    voucherType: '0',
    maxReduced: 0,
    conditionApply: 0,
    quantity: 0,
    limitCustomer: '',
    customerAdminDTOList: '',
    apply: '2',
    allow: '',
    optionCustomer: '0',
    createName: localStorage.getItem('fullname'),
  };
  currentDate: Date = new Date();
  validQuantity: ValidateInput = new ValidateInput();
  validName: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  validReducedValue: ValidateInput = new ValidateInput();
  validMaxReduced: ValidateInput = new ValidateInput();
  validconditionApply: ValidateInput = new ValidateInput();

  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  isEndDateValid() {
    this.checkEndDateNull = false;
    if (this.voucher.endDate === '' || this.voucher.endDate === null
      || this.voucher.endDate === undefined){
      this.checkEndDateNull = true;
      this.checkEndDate = false;
      return;
    }
    if (
      this.voucher.startDate &&
      this.voucher.endDate &&
      this.voucher.startDate >= this.voucher.endDate
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
    if (this.voucher.startDate === '' || this.voucher.startDate === null
      || this.voucher.startDate === undefined){
      this.checkStartDateNull = true;
      this.checkStartDate = false;
      return;
    }
    if (new Date(this.voucher.startDate).getTime() < date.getTime()){
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
  ngOnInit(): void {
    this.voucherService.getCustomer().subscribe((response) => {
      this.rowData = response;
      console.log(response);
    });
    this.isHidden = true;
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      console.log(id);
      this.voucherService.getDetailVoucher(id).subscribe((response: any[]) => {
        const firstElement = Array.isArray(response) ? response[0] : response;
        console.log(firstElement);
        this.voucher.id = firstElement.id;
        this.voucher.name = firstElement.name;
        this.voucher.description = firstElement.description;
        this.voucher.conditionApply = firstElement.conditionApply;
        this.voucher.voucherType = firstElement.voucherType;
        this.voucher.endDate = this.formatDate(firstElement.endDate);
        this.voucher.quantity = firstElement.quantity;
        this.voucher.customerAdminDTOList = firstElement.customerAdminDTOList;
        this.voucher.reducedValue = firstElement.reducedValue;
        this.voucher.apply = firstElement.apply;
        this.voucher.limitCustomer = firstElement.limitCustomer;
        this.voucher.maxReduced = firstElement.maxReduced;
        this.voucher.startDate = this.formatDate(firstElement.startDate);
        this.voucher.allow = firstElement.allow;
        this.voucher.maxReduced = firstElement.maxReduced;
        console.log(this.voucher);
      });
    });
    console.log(this.voucher);
  }
  editVoucher(){
    this.validateQuantity();
    this.isEndDateValid();
    this.isStartDateValid();
    this.validateName();
    this.validateReducedValue();
    this.validateDescription();
    this.validateMaxReducedValue();
    this.validateConditionApply();
    if (!this.validName.done || !this.validDescription.done || !this.validReducedValue.done
      || !this.validQuantity.done || !this.validconditionApply.done ||
      this.checkStartDate || this.checkStartDateNull || this.checkEndDate || this.checkEndDateNull) {
      return;
    }
    if (this.voucher.voucherType === 1 && !this.validMaxReduced.done){
      return;
    }
    if (this.voucher.optionCustomer == 1 && this.voucher.limitCustomer > this.voucher.quantity) {
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Giới hạn sử dụng với mỗi khách hàng phải nhỏ hơn số lượng');
      return;
    }
    const arrayCustomer = this.voucher.optionCustomer == 0 ? null : this.gridApi?.getSelectedRows?.();

    if (arrayCustomer && arrayCustomer.length <= 0 && this.voucher.optionCustomer == 1) {
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Không có khách hàng');
      return;
    }

    Swal.fire({
      title: 'Bạn có muốn sửa Voucher không?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sửa'
    }).then((result) => {
      if (result.isConfirmed) {
        const arrayCustomer = this.voucher.optionCustomer === '0' ? null : this.gridApi.getSelectedRows();
        const obj = {
          ...this.voucher,
          allow: this.checkAllow === true ? 1 : 0,
          customerAdminDTOList: arrayCustomer,
        };
        this.voucherService.updateVoucher(this.voucher.id, obj).subscribe(
          (response) => {
            this.router.navigateByUrl('/admin/voucher');
          },
          (error) => {
            this.toastr.error('Sửa Voucher thất bại');
            // Handle errors if the discount creation fails
            console.error('Error adding discount', error);
          }
        );
        Swal.fire({
          title: 'Sửa Voucher thành công',
          icon: 'success'
        });
      }
    });
  }
  toggleAllowDiscount(event: any) {
    this.checkAllow = event.target.checked;
    console.log(event);
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateName() {
    this.validName = CommonFunction.validateInput(this.voucher.name, 50, null );
  }
  validateQuantity() {
    this.validQuantity = CommonFunction.validateInput(this.voucher.quantity, 50, /^[1-9]\d*(\.\d+)?$/ );
  }
  validateDescription() {this.validDescription = CommonFunction.validateInput(this.voucher.description, 50, null );
  }
  validateReducedValue() {
    this.validReducedValue = CommonFunction.validateInput(this.voucher.reducedValue, 250, /^[1-9]\d*(\.\d+)?$/);
  }
  validateMaxReducedValue() {
    this.validMaxReduced = CommonFunction.validateInput(this.voucher.maxReduced, 250, /^[1-9]\d*(\.\d+)?$/);
  }
  validateConditionApply() {
    this.validconditionApply = CommonFunction.validateInput(this.voucher.conditionApply, 250, /^[0-9]\d*(\.\d+)?$/);
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm') || '';
  }}
