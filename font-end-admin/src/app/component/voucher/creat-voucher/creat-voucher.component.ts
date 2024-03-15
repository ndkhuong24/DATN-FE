import {Component, OnInit} from '@angular/core';
import {VoucherService} from 'src/app/service/voucher.service';
import {Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import Swal from 'sweetalert2';
import {ValidateInput} from "../../model/validate-input";
import {CommonFunction} from "../../../util/common-function";


@Component({
  selector: 'app-creat-voucher',
  templateUrl: './creat-voucher.component.html',
  styleUrls: ['./creat-voucher.component.css'],
})
export class CreatVoucherComponent implements OnInit {
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  checkAllow: boolean = false;
  checkStartDate: boolean = false;
  checkStartDateNull = false;
  checkEndDate: boolean = false;
  checkEndDateNull = false;
  disableCheckLimitCustomer: boolean = false;
  voucher: any = {
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    reducedValue: '',
    voucherType: '0',
    maxReduced: 0,
    conditionApply: 0,
    quantity: 1,
    limitCustomer: '',
    customerAdminDTOList: '',
    apply: 2,
    allow: '',
    optionCustomer: 0,
    createName: localStorage.getItem('fullname'),
  };
  validName: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  validReducedValue: ValidateInput = new ValidateInput();
  validMaxReduced: ValidateInput = new ValidateInput();
  validconditionApply: ValidateInput = new ValidateInput();
  validQuantity: ValidateInput = new ValidateInput();
  currentDate: Date = new Date();
  gridApi: any;
  fullname = '';

  constructor(private voucherService: VoucherService,
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

  toggleAllowDiscount(event: any) {
    this.checkAllow = event.target.checked;
    console.log(event);
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
    const arrayCustomer = this.voucher.optionCustomer === 0 ? null : this.gridApi.getSelectedRows();
    if ( arrayCustomer && arrayCustomer.length <= 0 && this.voucher.optionCustomer == 1){
      this.disableCheckLimitCustomer = true;
      this.toastr.error('Không có khách hàng ');
      return;
    }
    Swal.fire({
      title: 'Bạn có muốn thêm Voucher không?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thêm'
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = {
          ...this.voucher,
          allow: this.checkAllow === true ? 1 : 0,
          customerAdminDTOList: arrayCustomer,
        };
        this.voucherService.createVoucher(obj).subscribe(
          (response) => {
            this.router.navigateByUrl('/admin/voucher');
          },
          (error) => {
            this.toastr.error('Thêm Voucher thất bại');
            // Handle errors if the discount creation fails
            console.error('Error adding discount', error);
          }
        );
        Swal.fire({
          title: 'Thêm Voucher thành công',
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

}
