import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {VoucherShipService} from '../../../service/voucher-ship.service';
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {ValidateInput} from "../../model/validate-input";
import {CommonFunction} from "../../../util/common-function";

@Component({
  selector: 'app-creat-voucher-ship',
  templateUrl: './creat-voucher-ship.component.html',
  styleUrls: ['./creat-voucher-ship.component.css']
})
export class CreatVoucherShipComponent implements OnInit {
  checkStartDate: boolean = false;
  checkStartDateNull = false;
  checkEndDate: boolean = false;
  checkEndDateNull = false;
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  voucher: any = {
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    reducedValue: 0,
    conditionApply: 0,
    quantity: 1,
    customerAdminDTOList: '',
    optionCustomer: '0',
    limitCustomer: '',
    createName: localStorage.getItem('fullname'),
  };
  validName: ValidateInput = new ValidateInput();
  validQuantity: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  validReducedValue: ValidateInput = new ValidateInput();
  validconditionApply: ValidateInput = new ValidateInput();
  currentDate: Date = new Date();
  gridApi: any;
   disableCheckLimitCustomer: boolean = false;
  constructor(private voucherService: VoucherShipService,
              private  router: Router,
              private toastr: ToastrService) {
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
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  isValidDateRange(): void {
    if (
      this.voucher.startDate &&
      this.voucher.endDate &&
      this.voucher.startDate > this.voucher.endDate
    ) {
      this.checkEndDate = true;
      console.log('Date range is valid.');
    } else {
      this.checkEndDate = false;
      // Cũng có thể thực hiện công việc khác nếu cần.
      console.log('Date range is not valid.');
    }
  }
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
  ngOnInit(): void {
    this.voucherService.getCustomer().subscribe((response) => {
      this.rowData = response;
      console.log(response);
    });
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  addVoucher() {
    this.validateQuantity();
    this.isStartDateValid();
    this.isEndDateValid();
    this.validateName();
    this.validateReducedValue();
    this.validateDescription();
    this.validateConditionApply();
    if (!this.validName.done || !this.validDescription.done || !this.validReducedValue.done
      || !this.validQuantity.done || !this.validconditionApply.done ||
      this.checkStartDate || this.checkStartDateNull || this.checkEndDate || this.checkEndDateNull) {
      return;
    }
    if (this.voucher.optionCustomer == 1 && this.voucher.limitCustomer > this.voucher.quantity) {
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Giới hạn sử dụng với mỗi khách hàng phải nhỏ hơn số lượng');
      return;
    }
    const arrayCustomer = this.voucher.optionCustomer == '0' ? null : this.gridApi.getSelectedRows();
    if (arrayCustomer && arrayCustomer.length <= 0 && this.voucher.optionCustomer == 1){
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Không có khách hàng ');
      return;
    }
    Swal.fire({
      title: 'Bạn có muốn thêm Voucher FreeShip không?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thêm'
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = {
          ...this.voucher,
          customerAdminDTOList: arrayCustomer,
        };
        this.voucherService.createVoucher(obj).subscribe(
          (response) => {
            // Handle the response if needed, e.g., show a success message
            this.router.navigateByUrl('/admin/voucherFS');
          },
          (error) => {
            // Handle errors if the discount creation fails
            this.toastr.error('Thêm Voucher FreeShip thất bại');
          }
        );
        Swal.fire({
          title: 'Thêm Voucher FreeShip thành công',
          icon: 'success'
        });
      }
    });
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateName() {
    this.validName = CommonFunction.validateInput(this.voucher.name, 50, null );
  }
  validateDescription() {this.validDescription = CommonFunction.validateInput(this.voucher.description, 50, null);
  }
  validateReducedValue() {
    this.validReducedValue = CommonFunction.validateInput(this.voucher.reducedValue, 250, /^[1-9]\d*(\.\d+)?$/);
  }
  validateConditionApply() {
    this.validconditionApply = CommonFunction.validateInput(this.voucher.conditionApply, 250, /^[0-9]\d*(\.\d+)?$/);
  }
  validateQuantity() {
    this.validQuantity = CommonFunction.validateInput(this.voucher.quantity, 50, /^[1-9]\d*(\.\d+)?$/ );
  }

}
