import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ColDef, ColumnApi, ColumnResizedEvent, GridReadyEvent, GridApi} from 'ag-grid-community';
import {all} from 'codelyzer/util/function';
import {StaffService} from '../../service/staff.service';
import {UsersDTO} from '../model/UsersDTO';
import {CustomerComponent} from '../customer/customer.component';
import {UpdateStaffComponent} from './update-staff/update-staff.component';
import {MatDialog} from '@angular/material/dialog';
import {DetailStaffComponent} from './detail-staff/detail-staff.component';
import {OrderService} from '../../service/order.service';
import {formatDate, formatDateTime, formatMoney} from '../../util/util';
import {OrderDetailComponent} from '../order/order-detail/order-detail.component';
import {ActionDiscountComponent} from '../discount/action-discount/action-discount.component';
import {ActionStaffComponent} from './action-staff/action-staff.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  animal: string;
  listStaff: UsersDTO[] = [];
  searchStaff: string;
  currentPage = 1;
  // itemsPerPage = 5; // Số mục hiển thị trên mỗi trang
  // totalItems = this.listStaff.length; // Tổng số mục trong danh sách
  // constructor(private staffService: StaffService, private dialog: MatDialog) { }
  //
  // ngOnInit(): void {
  //   this.getAllStaff();
  // }
  // getAllStaff(){
  //   this.staffService.getAllStaff().subscribe(
  //     data => {
  //       console.log(data);
  //       this.listStaff = data;
  //     }
  //   );
  // }
  // openDialog(staff): void {
  //   const dialogRef = this.dialog.open(DetailStaffComponent, {
  //     width: '1200px',
  //     height: '600px',
  //     data: {staffData: staff}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     this.animal = result;
  //   });
  // }

  // pageChanged(event: any): void {
  //   this.currentPage = event.page;
  // }
  active = 1;
  listStatus: any = [];
  status = 6;
  rowData;
  columnDefs;
  gridApi;
  gridColumnApi;
  user: any = {
    id: null,
    code: null,
    fullname: '',
    phone: '',
    email: '',
  };
  modelSearch: any = {
    code: null,
    dateFrom: null,
    dateTo: null
  };
  allOrder: any = [];
  sCOrder: any = [];
  constructor( private matDialog: MatDialog, private orderService: StaffService, private cdr: ChangeDetectorRef) {
    const lst =
      [
        {name: 'Hoàn thành', id: 3},
      ];
    this.listStatus = lst;
    this.columnDefs = [
      {
        headerName: 'STT',
        field: '',
        suppressMovable: true,
        minWidth: 60,
        maxWidth: 60,
        valueGetter: param => {
          return param.node.rowIndex + 1;
        },
      },
      {
        headerName: 'Mã nhân viên',
        field: 'code',
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#36f',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          cursor: 'pointer',
          // textAlign: 'center',
          'justify-content': 'center',
        },
      },
      {
        headerName: 'Họ và tên',
        field: 'fullname',
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
      },
      {
        headerName: 'Ngày sinh',
        field: 'birthday',
        suppressMovable: true,
        valueFormatter: params => {
          return formatDateTime(params.data.createDate);
        },
        cellStyle: {

          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
      },
      {
        headerName: 'Giới tính',
        field: 'gender',
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
      },
      {
        headerName: 'Địa chỉ',
        field: 'description',
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
      }, {
        headerName: 'Số điện thoại',
        field: 'phone',
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
      }, {
        headerName: 'Trạng Thái',
        field: 'isdel',
        suppressMovable: true,
        valueGetter: (params) => {
          const status = params.data.isdel;
          switch (status) {
            case 0:
              return 'Đang hoạt động';
            case 1:
              return 'Ngừng hoạt động';
            default:
              return 'Đang hoạt động';
          }
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
      },
      {
        headerName: 'Action',
        field: '',
        cellRendererFramework: ActionStaffComponent,
        pinned: 'right',
      },
    ];
    this.rowData = [];
    const storedUserString = localStorage.getItem('users');

    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      this.user = {
        id: storedUser.id,
        code: storedUser.code,
        fullname: storedUser.fullname,
        phone: storedUser.phone,
        email: storedUser.email,
      };
    }
  }
  finbyStaffLike(){
    if (this.searchStaff === ''){
      this.orderService.getAllStaff().subscribe(
        data => {
          this.listStaff = data;
          this.rowData = this.listStaff;
        }
      );
    }else {
      this.orderService.findByCodeOrPhoneLike(this.searchStaff).subscribe(
        data => {
          this.listStaff = data;
          this.rowData = this.listStaff;
          console.log(this.listStaff);
        }
      );
    }

  }
  ngOnInit(): void {
    this.getAllOrder();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getAllOrder(): void {
    this.orderService.getAllStaff().subscribe(res => {
      this.allOrder = res;
      this.rowData = this.allOrder;
      console.log(this.rowData);
    });
    this.cdr.detectChanges();
  }

  tabChanged(event: any) {
    const selectedTabIndex = event.index;
    const selectedTabId = this.listStatus[selectedTabIndex].id;
    this.status = selectedTabId;
    this.getAllOrder();
  }

  openXemChiTiet(dataOrder) {
    this.matDialog.open(DetailStaffComponent, {
      width: '150vh',
      height: '90vh',
      data: {
        data: dataOrder,
        staff: this.user
      }
    }).afterClosed().subscribe(res => {
      if (res === 'update-order') {
        this.ngOnInit();
      }
    });
  }
  searchOrder() {
    console.log(this.modelSearch);
    this.getAllOrder();
    this.cdr.detectChanges();
  }
}
