import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {formatDate, formatDateTime, formatMoney} from '../../util/util';
import {OrderService} from '../../service/order.service';
import {ActionOrderComponent} from './action-order/action-order.component';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
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
  totalStatus: any;

  constructor(private matDialog: MatDialog, private orderService: OrderService, private cdr: ChangeDetectorRef) {
    const lst =
      [
        {name: 'Tất cả', id: 6},
        {name: 'Chờ xác nhận', id: 0},
        {name: 'Chờ xử lý', id: 1},
        {name: 'Đang giao hàng', id: 2},
        {name: 'Hoàn thành', id: 3},
        {name: 'Đã Hủy', id: 4},
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
        headerName: 'Mã đơn hàng',
        field: 'code',
        suppressMovable: true,
        sortable: true,
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
        onCellClicked: (params) => {
          return this.openXemChiTiet(params.data);
        }
      },
      {
        headerName: 'Ngày Tạo',
        field: 'createDate',
        sortable: true,
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
        headerName: 'Khách Hàng',
        field: 'customerAdminDTO.fullname',
        suppressMovable: true,
        filter: true,
        sortable: true,
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
        valueFormatter: params => {
          return params.data.idCustomer === null ? 'Khách ẩn danh' : params.data.customerAdminDTO.fullname;
        },
      },
      {
        headerName: 'Thanh Toán',
        sortable: true,
        field: 'statusPayment',
        valueFormatter: params => {
          return params.data.statusPayment === 0 ? 'Đã thanh toán' : 'Chưa thanh toán';
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
      }, {
        headerName: 'Tổng Tiền',
        field: 'totalPayment',
        sortable: true,
        suppressMovable: true,
        valueFormatter: params => {
          return formatMoney(params.data.totalPayment);
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
      }, {
        headerName: 'Trạng Thái',
        field: 'status',
        suppressMovable: true,
        filter: true,
        sortable: true,
        valueGetter: (params) => {
          const status = params.data.status;
          switch (status) {
            case 0:
              return 'Chờ xác nhận';
            case 1:
              return 'Chờ xử lý';
            case 2:
              return 'Đang giao hàng';
            case 3:
              return 'Hoàn thành';
            case 4:
              return 'Đã Hủy';
            default:
              return 'Không xác định';
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
      }
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

  ngOnInit(): void {
    this.getAllOrder();
    this.getTotalStatus();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getAllOrder(): void {
    const obj = {
      code: this.modelSearch.code,
      dateFrom: this.modelSearch.dateFrom !== null ? formatDate(this.modelSearch.dateFrom) : null,
      dateTo: this.modelSearch.dateTo !== null ? formatDate(this.modelSearch.dateTo) : null,
      status: this.status
    };
    this.orderService.getAllOrderAdmin(obj).subscribe(res => {
      this.rowData = res;
      console.log(this.rowData);
    });
    this.cdr.detectChanges();
  }

  getTotalStatus(): void {
    const obj = {
      dateFrom: this.modelSearch.dateFrom !== null ? formatDate(this.modelSearch.dateFrom) : null,
      dateTo: this.modelSearch.dateTo !== null ? formatDate(this.modelSearch.dateTo) : null,
    };
    this.orderService.totalStatusOrderAdmin(obj).subscribe(res => {
      this.totalStatus = res;
      console.log(this.totalStatus);
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
    this.matDialog.open(OrderDetailComponent, {
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
    this.getTotalStatus();
    this.cdr.detectChanges();
  }
}
