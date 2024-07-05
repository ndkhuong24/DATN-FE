import { Component, OnInit } from '@angular/core';
import { VoucherService } from 'src/app/service/voucher.service';
import { ToastrService } from "ngx-toastr";
import Swal from 'sweetalert2';
import { ValidateInput } from "../../model/validate-input";
import { CommonFunction } from "../../../util/common-function";
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-creat-voucher',
  templateUrl: './creat-voucher.component.html',
  styleUrls: ['./creat-voucher.component.css'],
})

export class CreatVoucherComponent implements OnInit {
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;

  checkAllow: boolean = false;
  checkStartDate: boolean = false;
  checkStartDateNull: boolean = false;
  checkEndDate: boolean = false;
  checkEndDateNull: boolean = false;
  disableCheckLimitCustomer: boolean = false;

  public rowSelection: 'single' | 'multiple' = 'multiple';

  Name: string;
  validName: ValidateInput = new ValidateInput();

  StartDate: any;
  EndDate: any;

  Description: string;
  validDescription: ValidateInput = new ValidateInput();

  ConditionApply: number = 1;
  validconditionApply: ValidateInput = new ValidateInput();

  VoucherType: number = 0;

  ReducedValue: number = 1;
  validReducedValue: ValidateInput = new ValidateInput();

  MaxReduced: number = 1;
  validMaxReduced: ValidateInput = new ValidateInput();

  Quantity: number = 1;
  validQuantity: ValidateInput = new ValidateInput();

  Apply: number = 2;

  OptionCustomer: number = 0;

  LimitCustomer: number = 1;
  validLimitCustomer: ValidateInput = new ValidateInput();

  Allow: number = 1;

  currentDate: Date = new Date();

  CustomerAdminDTOList: any;

  gridApi: any;

  constructor(
    private voucherService: VoucherService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreatVoucherComponent>,
  ) {
    this.columnDefs = [
      {
        headerName: 'Mã Khách hàng',
        field: 'code',
        sortable: true,
        filter: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: true,
        flex: 1,
      },
      {
        headerName: 'Tên khách hàng',
        field: 'fullname',
        sortable: true,
        filter: true,
        editable: true,
        flex: 1,
      },
      {
        headerName: 'Ngày sinh',
        field: 'birthday',
        sortable: true,
        filter: true,
        editable: true,
        flex: 1,
      },
      {
        headerName: 'Giới tính',
        field: 'gender',
        sortable: true,
        filter: true,
        editable: true,
        flex: 1,
      },
      {
        headerName: 'Số lượt mua',
        field: 'orderCount',
        sortable: true,
        filter: true,
        editable: true,
        flex: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.voucherService.getCustomer().subscribe((response) => {
      this.rowData = response;
    });
  }

  isEndDateValid() {
    this.checkEndDateNull = false;

    if (this.EndDate === '' || this.EndDate === null
      || this.EndDate === undefined) {
      this.checkEndDateNull = true;
      this.checkEndDate = false;
      return;
    }

    if (
      this.StartDate &&
      this.EndDate &&
      this.StartDate >= this.EndDate
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

    if (this.StartDate === '' || this.StartDate === null
      || this.StartDate === undefined) {
      this.checkStartDateNull = true;
      this.checkStartDate = false;
      return;
    }

    if (new Date(this.StartDate).getTime() < date.getTime()) {
      this.checkStartDate = true;
      this.checkStartDateNull = false;
      return;
    }

    this.checkStartDateNull = false;
    this.checkStartDate = false;
  }

  removeCheckStartDate() {
    this.checkStartDateNull = false;
    this.checkStartDate = false;
  }

  removeCheckEndDate() {
    this.checkEndDateNull = false;
    this.checkEndDate = false;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  addVoucher() {
    this.isEndDateValid();
    this.isStartDateValid();
    this.validateName();
    this.validateReducedValue();
    this.validateDescription();
    this.validateMaxReducedValue();
    this.validateConditionApply();
    this.validateQuantity();
    this.validateLimitCustomer();

    if (!this.validName.done || !this.validDescription.done || !this.validReducedValue.done
      || !this.validQuantity.done || !this.validconditionApply.done ||
      this.checkStartDate || this.checkStartDateNull || this.checkEndDate || this.checkEndDateNull) {
      return;
    }

    if (this.VoucherType === 1 && !this.validMaxReduced.done) {
      return;
    }

    if (this.OptionCustomer === 1 && !this.validLimitCustomer.done) {
      return;
    }

    if (this.OptionCustomer == 1 && this.LimitCustomer > this.Quantity) {
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Giới hạn sử dụng với mỗi khách hàng phải nhỏ hơn số lượng');
      return;
    }

    const arrayCustomer = this.OptionCustomer === 0 ? null : this.gridApi.getSelectedRows();

    if (arrayCustomer && arrayCustomer.length <= 0 && this.OptionCustomer === 1) {
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Không có khách hàng ');
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
    }).then((result) => {
      if (result.isConfirmed) {
        const voucher = {
          name: this.Name,
          startDate: this.StartDate,
          endDate: this.EndDate,
          description: this.Description,
          conditionApply: this.ConditionApply,

          voucherType: this.VoucherType,
          reducedValue: this.ReducedValue,
          maxReduced: this.MaxReduced,
          quantity: this.Quantity,
          apply: this.Apply,
          optionCustomer: this.OptionCustomer,

          limitCustomer: this.LimitCustomer,
          customerAdminDTOList: arrayCustomer,

          allow: this.Allow,
          createName: localStorage.getItem('fullname'),
        }

        this.voucherService.createVoucher(voucher).subscribe(
          result => {
            console.log('Product add success', result);
            this.dialogRef.close('addVoucher');
          },
          (error: any) => {
            console.error('Product add error', error);
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

  revoveInvalid(result: { done: boolean; }) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.Name, 50, null);
  }

  validateQuantity() {
    this.validQuantity = CommonFunction.validateInput(this.Quantity, 50, /^[1-9]\d*(\.\d+)?$/);
  }

  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.Description, 250, null);
  }

  validateReducedValue() {
    this.validReducedValue = CommonFunction.validateInput(this.ReducedValue, 250, /^[1-9]\d*(\.\d+)?$/);
  }

  validateMaxReducedValue() {
    this.validMaxReduced = CommonFunction.validateInput(this.MaxReduced, 250, /^[1-9]\d*(\.\d+)?$/);
  }

  validateConditionApply() {
    this.validconditionApply = CommonFunction.validateInput(this.ConditionApply, 250, /^[0-9]\d*(\.\d+)?$/);
  }

  validateLimitCustomer() {
    this.validLimitCustomer = CommonFunction.validateInput(this.LimitCustomer, 250, /^[1-9]\d*(\.\d+)?$/);
  }
}
