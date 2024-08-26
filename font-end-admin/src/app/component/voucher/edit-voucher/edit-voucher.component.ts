import { Component, Inject, OnInit } from '@angular/core';
import { VoucherService } from '../../../service/voucher.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ValidateInput } from '../../model/validate-input';
import { CommonFunction } from '../../../util/common-function';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: ['./edit-voucher.component.css'],
})

export class EditVoucherComponent implements OnInit {
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

  idVoucher: number;
  data: any;
  allowCurrent: number = 1;

  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  disableCheckLimitCustomer: boolean = false;
  checkAllow: boolean = false;

  checkStartDate: boolean = false;
  checkStartDateNull = false;
  checkEndDate: boolean = false;
  checkEndDateNull = false;

  gridApi: any;

  validQuantity: ValidateInput = new ValidateInput();
  validName: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  validReducedValue: ValidateInput = new ValidateInput();
  validMaxReduced: ValidateInput = new ValidateInput();
  validconditionApply: ValidateInput = new ValidateInput();
  validLimitCustomer: ValidateInput = new ValidateInput();

  public rowSelection: 'single' | 'multiple' = 'single';

  constructor(
    public dialogRef: MatDialogRef<EditVoucherComponent>,
    @Inject(MAT_DIALOG_DATA) public response: any,
    private voucherService: VoucherService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) {

    this.idVoucher = response.idVoucher;

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
      // {
      //   headerName: 'Ngày sinh',
      //   field: 'birthday',
      //   sortable: true,
      //   filter: true,
      //   editable: true,
      //   flex: 1,
      // },
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
    this.voucherService.getDetailVoucher(this.idVoucher).subscribe((response: any[]) => {
      const firstElement = Array.isArray(response) ? response[0] : response;

      this.voucher.id = firstElement.id;
      this.voucher.name = firstElement.name;
      this.voucher.description = firstElement.description;
      this.voucher.conditionApply = firstElement.conditionApply;
      this.voucher.voucherType = firstElement.voucherType;
      this.voucher.endDate = this.formatDate(new Date(firstElement.endDate));;
      this.voucher.quantity = firstElement.quantity;
      this.voucher.reducedValue = firstElement.reducedValue;
      this.voucher.maxReduced = firstElement.maxReduced;
      this.voucher.startDate = this.formatDate(new Date(firstElement.startDate));;
      this.voucher.allow = firstElement.allow;
      this.voucher.apply = firstElement.apply;
      this.voucher.createDate = firstElement.createDate;
      this.voucher.optionCustomer = firstElement.optionCustomer;
      this.voucher.limitCustomer = firstElement.limitCustomer;
      this.voucher.customerAdminDTOList = firstElement.customerAdminDTOList;
    });

    this.voucherService.getCustomer().subscribe((response) => {
      this.rowData = response;
    });
  }

  isEndDateValid() {
    this.checkEndDateNull = false;

    if (
      this.voucher.endDate === '' ||
      this.voucher.endDate === null ||
      this.voucher.endDate === undefined
    ) {
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

    if (
      this.voucher.startDate === '' ||
      this.voucher.endDate === null ||
      this.voucher.startDate === undefined
    ) {
      this.checkStartDateNull = true;
      this.checkStartDate = false;
      return;
    }

    if (new Date(this.voucher.startDate).getTime() < date.getTime()) {
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

  clickUpdate() {
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

    if (this.voucher.voucherType === 1 && !this.validMaxReduced.done) {
      return;
    }

    if (this.voucher.optionCustomer === 1 && !this.validLimitCustomer.done) {
      return;
    }

    if (this.voucher.optionCustomer == 1 && this.voucher.limitCustomer > this.voucher.quantity) {
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Giới hạn sử dụng với mỗi khách hàng phải nhỏ hơn số lượng');
      return;
    }

    const arrayCustomer = this.voucher.optionCustomer === 0 ? null : this.gridApi.getSelectedRows();

    if (arrayCustomer && arrayCustomer.length <= 0 && this.voucher.optionCustomer === 1) {
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Không có khách hàng ');
      return;
    }

    Swal.fire({
      title: 'Bạn muốn cập nhật không',
      text: 'Thao tác này sẽ không hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#dd3333',
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Thoát'
    }).then((result) => {
      if (result.isConfirmed) {
        const voucherCurrent = {
          name: this.voucher.name,
          startDate: this.voucher.startDate,
          endDate: this.voucher.endDate,
          description: this.voucher.description,
          conditionApply: this.voucher.conditionApply,

          voucherType: this.voucher.voucherType,
          reducedValue: this.voucher.reducedValue,
          maxReduced: this.voucher.maxReduced,
          quantity: this.voucher.quantity,
          apply: this.voucher.apply,
          optionCustomer: this.voucher.optionCustomer,

          limitCustomer: this.voucher.limitCustomer,
          customerAdminDTOList: arrayCustomer,

          allow: this.allowCurrent,
          createName: localStorage.getItem('fullname'),
        }

        this.voucherService.updateVoucher(this.idVoucher, voucherCurrent).subscribe(
          result => {
            console.log('Product add success', result);
            this.dialogRef.close('saveVoucher');
          },
          (error: any) => {
            console.error('Product add error', error);
          }
        );
        Swal.fire({
          title: 'Cập nhật',
          text: 'Cập nhật thành công thành công',
          icon: 'success'
        });
      }
    })
  }

  revoveInvalid(result: { done: boolean }) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.voucher.name, 50, null);
  }

  validateQuantity() {
    this.validQuantity = CommonFunction.validateInput(
      this.voucher.quantity,
      50,
      /^[1-9]\d*(\.\d+)?$/
    );
  }

  validateDescription() {
    this.validDescription = CommonFunction.validateInput(
      this.voucher.description,
      250,
      null
    );
  }

  validateReducedValue() {
    this.validReducedValue = CommonFunction.validateInput(
      this.voucher.reducedValue,
      250,
      /^[1-9]\d*(\.\d+)?$/
    );
  }

  validateMaxReducedValue() {
    this.validMaxReduced = CommonFunction.validateInput(
      this.voucher.maxReduced,
      250,
      /^[1-9]\d*(\.\d+)?$/
    );
  }

  validateConditionApply() {
    this.validconditionApply = CommonFunction.validateInput(
      this.voucher.conditionApply,
      250,
      /^[0-9]\d*(\.\d+)?$/
    );
  }

  validateLimitCustomer() {
    this.validLimitCustomer = CommonFunction.validateInput(
      this.voucher.limitCustomer,
      250,
      /^[1-9]\d*(\.\d+)?$/
    );
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm') || '';
  }

  // preventNegative(event: any) {
  //   if (event.target.value < 1) {
  //     event.target.value = 1;
  //     if (event.target.name === 'quantity') {
  //       this.voucher.quantity = 1;
  //     } else if (event.target.name === 'maxReduced') {
  //       this.voucher.maxReduced = 1;
  //     } else if (event.target.name === 'conditionApply') {
  //       this.voucher.conditionApply = 1;
  //     } else if (event.target.name === 'reducedValue') {
  //       this.voucher.reducedValue = 1;
  //     } else if (event.target.name === 'limitCustomer') {
  //       this.voucher.limitCustomer = 1;
  //     }
  //   }
  // }

  preventNegative(event: any) {
    let value = event.target.value;
    const name = event.target.name;

    // Regular expression to match positive integers
    const positiveIntegerRegex = /^[1-9]\d*$/;

    if (!positiveIntegerRegex.test(value)) {
      value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      value = value.replace(/^0+/, ''); // Remove leading zeros

      if (value === '' || value === '0') {
        value = '1'; // Default to 1 if the input is invalid
      }

      event.target.value = value;

      // Update the corresponding property based on the input name
      switch (name) {
        case 'quantity':
          this.voucher.quantity = parseInt(value, 10);
          break;
        case 'maxReduced':
          this.voucher.maxReduced = parseInt(value, 10);
          break;
        case 'conditionApply':
          this.voucher.conditionApply = parseInt(value, 10);
          break;
        case 'reducedValue':
          this.voucher.reducedValue = parseInt(value, 10);
          break;
        case 'limitCustomer':
          this.voucher.limitCustomer = parseInt(value, 10);
          break;
      }
    }
  }
}
