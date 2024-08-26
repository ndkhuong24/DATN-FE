import { Component, Inject, OnInit } from '@angular/core';
import { VoucherShipService } from "../../../service/voucher-ship.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { ValidateInput } from "../../model/validate-input";
import { CommonFunction } from "../../../util/common-function";
import { DatePipe } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-voucher-ship',
  templateUrl: './edit-voucher-ship.component.html',
  styleUrls: ['./edit-voucher-ship.component.css']
})

export class EditVoucherShipComponent implements OnInit {
  voucherFreeShip: any = {
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    reducedValue: 0,
    conditionApply: '',
    quantity: 0,
    optionCustomer: '0',
    customerAdminDTOList: '',
    limitCustomer: '',
  };

  idVoucherFreeShip: number;
  data: any;
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  disableCheckLimitCustomer: boolean = false;

  checkStartDate: boolean = false;
  checkStartDateNull = false;
  checkEndDate: boolean = false;
  checkEndDateNull = false;

  gridApi: any;

  validQuantity: ValidateInput = new ValidateInput();
  validName: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  validReducedValue: ValidateInput = new ValidateInput();
  validconditionApply: ValidateInput = new ValidateInput();
  validLimitCustomer: ValidateInput = new ValidateInput();

  public rowSelection: 'single' | 'multiple' = 'single';

  constructor(
    public dialogRef: MatDialogRef<EditVoucherShipComponent>,
    @Inject(MAT_DIALOG_DATA) public response: any,
    private voucherShipService: VoucherShipService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {

    this.idVoucherFreeShip = response.idVoucherShip;

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
        headerName: 'Số điện thoại',
        field: 'phone',
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
    this.voucherShipService.getCustomer().subscribe((response) => {
      this.rowData = response;
    });

    this.voucherShipService.getDetailVoucher(this.idVoucherFreeShip).subscribe((response: any[]) => {
      const firstElement = Array.isArray(response) ? response[0] : response;

      this.voucherFreeShip.id = firstElement.id;
      this.voucherFreeShip.name = firstElement.name;
      this.voucherFreeShip.description = firstElement.description;
      this.voucherFreeShip.conditionApply = firstElement.conditionApply;
      this.voucherFreeShip.endDate = this.formatDate(new Date(firstElement.endDate));;
      this.voucherFreeShip.quantity = firstElement.quantity;
      this.voucherFreeShip.reducedValue = firstElement.reducedValue;
      this.voucherFreeShip.startDate = this.formatDate(new Date(firstElement.startDate));;
      this.voucherFreeShip.optionCustomer = firstElement.optionCustomer;
      this.voucherFreeShip.limitCustomer = firstElement.limitCustomer;
      this.voucherFreeShip.customerAdminDTOList = firstElement.customerAdminDTOList;
    });
  }

  isEndDateValid() {
    this.checkEndDateNull = false;

    if (this.voucherFreeShip.endDate === '' ||
      this.voucherFreeShip.endDate === null ||
      this.voucherFreeShip.endDate === undefined) {
      this.checkEndDateNull = true;
      this.checkEndDate = false;
      return;
    }

    if (
      this.voucherFreeShip.startDate &&
      this.voucherFreeShip.endDate &&
      this.voucherFreeShip.startDate >= this.voucherFreeShip.endDate
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

    if (this.voucherFreeShip.startDate === '' ||
      this.voucherFreeShip.startDate === null ||
      this.voucherFreeShip.startDate === undefined) {
      this.checkStartDateNull = true;
      this.checkStartDate = false;
      return;
    }

    if (new Date(this.voucherFreeShip.startDate).getTime() < date.getTime()) {
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
    this.validateConditionApply();
    this.validateQuantity();
    this.validateLimitCustomer();

    if (!this.validName.done || !this.validDescription.done || !this.validReducedValue.done
      || !this.validQuantity.done || !this.validconditionApply.done ||
      this.checkStartDate || this.checkStartDateNull || this.checkEndDate || this.checkEndDateNull) {
      return;
    }

    if (this.voucherFreeShip.optionCustomer === 1 && !this.validLimitCustomer.done) {
      return;
    }

    if (this.voucherFreeShip.optionCustomer == 1 && this.voucherFreeShip.limitCustomer > this.voucherFreeShip.quantity) {
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Giới hạn sử dụng với mỗi khách hàng phải nhỏ hơn số lượng');
      return;
    }

    const arrayCustomer = this.voucherFreeShip.optionCustomer === 0 ? null : this.gridApi.getSelectedRows();

    if (arrayCustomer && arrayCustomer.length <= 0 && this.voucherFreeShip.optionCustomer === 1) {
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
        const voucherFreeShipCurrent = {
          name: this.voucherFreeShip.name,
          startDate: this.voucherFreeShip.startDate,
          endDate: this.voucherFreeShip.endDate,
          description: this.voucherFreeShip.description,

          conditionApply: this.voucherFreeShip.conditionApply,
          reducedValue: this.voucherFreeShip.reducedValue,
          quantity: this.voucherFreeShip.quantity,
          optionCustomer: this.voucherFreeShip.optionCustomer,

          limitCustomer: this.voucherFreeShip.limitCustomer,
          customerAdminDTOList: arrayCustomer,
          createName: localStorage.getItem('fullname'),
        }

        this.voucherShipService.updateVoucher(this.idVoucherFreeShip, voucherFreeShipCurrent).subscribe(
          result => {
            console.log('Product add success', result);
            this.dialogRef.close('saveVoucherShip');
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

  // editVoucher() {
  //   this.validateQuantity();
  //   this.isStartDateValid();
  //   this.isEndDateValid();
  //   this.validateName();
  //   this.validateReducedValue();
  //   this.validateDescription();
  //   this.validateConditionApply();
  //   if (!this.validName.done || !this.validDescription.done || !this.validReducedValue.done
  //     || !this.validQuantity.done || !this.validconditionApply.done ||
  //     this.checkStartDate || this.checkStartDateNull || this.checkEndDate || this.checkEndDateNull) {
  //     return;
  //   }
  //   if (this.voucher.optionCustomer == 1 && this.voucher.limitCustomer > this.voucher.quantity) {
  //     this.disableCheckLimitCustomer = true;
  //     this.toastr.error('Giới hạn sử dụng với mỗi khách hàng phải nhỏ hơn số lượng');
  //     return;
  //   }
  //   const arrayCustomer = this.voucher.optionCustomer === '0' ? null : this.gridApi.getSelectedRows();
  //   if (arrayCustomer && arrayCustomer.length <= 0 && this.voucher.optionCustomer == 1) {
  //     this.disableCheckLimitCustomer = true;
  //     this.toastr.error('Không có khách hàng ');
  //     return;
  //   }
  //   Swal.fire({
  //     title: 'Bạn có muốn sửa Voucher FreeShip không?',
  //     icon: 'success',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sửa'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const obj = {
  //         ...this.voucher,
  //         customerAdminDTOList: arrayCustomer,
  //       };
  //       this.service.createVoucher(obj).subscribe(
  //         (response) => {
  //           // Handle the response if needed, e.g., show a success message
  //           this.rou.navigateByUrl('/admin/voucherFS');
  //         },
  //         (error) => {
  //           // Handle errors if the discount creation fails
  //           this.toastr.error('Sửa Voucher FreeShip thất bại');
  //         }
  //       );
  //       Swal.fire({
  //         title: 'Sửa Voucher FreeShip thành công',
  //         icon: 'success'
  //       });
  //     }
  //   });
  // }

  revoveInvalid(result: { done: boolean }) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.voucherFreeShip.name, 50, null);
  }

  validateQuantity() {
    this.validQuantity = CommonFunction.validateInput(
      this.voucherFreeShip.quantity,
      50,
      /^[1-9]\d*(\.\d+)?$/
    );
  }

  validateDescription() {
    this.validDescription = CommonFunction.validateInput(
      this.voucherFreeShip.description,
      250,
      null
    );
  }

  validateReducedValue() {
    this.validReducedValue = CommonFunction.validateInput(
      this.voucherFreeShip.reducedValue,
      250,
      /^[1-9]\d*(\.\d+)?$/
    );
  }

  validateConditionApply() {
    this.validconditionApply = CommonFunction.validateInput(
      this.voucherFreeShip.conditionApply,
      250,
      /^[0-9]\d*(\.\d+)?$/
    );
  }

  validateLimitCustomer() {
    this.validLimitCustomer = CommonFunction.validateInput(
      this.voucherFreeShip.limitCustomer,
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
  //       this.voucherFreeShip.quantity = 1;
  //     } else if (event.target.name === 'conditionApply') {
  //       this.voucherFreeShip.conditionApply = 1;
  //     } else if (event.target.name === 'reducedValue') {
  //       this.voucherFreeShip.reducedValue = 1;
  //     } else if (event.target.name === 'limitCustomer') {
  //       this.voucherFreeShip.limitCustomer = 1;
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
          this.voucherFreeShip.quantity = parseInt(value, 10);
          break;
        case 'conditionApply':
          this.voucherFreeShip.conditionApply = parseInt(value, 10);
          break;
        case 'reducedValue':
          this.voucherFreeShip.reducedValue = parseInt(value, 10);
          break;
        case 'limitCustomer':
          this.voucherFreeShip.limitCustomer = parseInt(value, 10);
          break;
      }
    }
  }
}
