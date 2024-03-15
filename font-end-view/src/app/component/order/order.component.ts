import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OrderService} from '../../service/order.service';
import {formatCurrency} from '@angular/common';
import {formatDate, formatDateTime, formatMoney, formatTime} from '../../util/util';
import {MatDialog} from '@angular/material/dialog';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {ActionOrderComponent} from './action-order/action-order.component';
import {FormControl} from '@angular/forms';
import {UtilService} from '../../util/util.service';

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
    dateFrom: null,
    dateTo: null,
    code: null,
  };
  constructor(private matDialog: MatDialog, private orderService: OrderService, private cdr: ChangeDetectorRef,
              private utilService: UtilService) {
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
        sortable: true,
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
        headerName: 'Thanh Toán',
        field: 'statusPayment',
        sortable: true,
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
        filter: true,
        sortable: true,
        suppressMovable: true,
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
    const storedUserString = localStorage.getItem('customer');

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
      status: this.status,
      idCustomer: this.user.id
    };
    this.orderService.getAllOrder(obj).subscribe(res => {
      this.rowData = res;
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
    this.matDialog.open(OrderDetailComponent, {
      width: '150vh',
      height: '90vh',
      data: {
        data: dataOrder,
        customer: this.user
      }
    }).afterClosed().subscribe(res => {
      if (res === 'update-order') {
        this.ngOnInit();
      }
    });
  }

  changeDateFrom(event: any) {
   console.log(formatDate(event));
  }

  searchOrder() {
      this.getAllOrder();
      this.cdr.detectChanges();
  }
}
