import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../service/order.service';
import { formatDate, formatDateTime, formatMoney } from '../../util/util';
import { OrderDetailComponent } from '../order/order-detail/order-detail.component';
import { OrderSalesDetailComponent } from './order-sales-detail/order-sales-detail.component';

@Component({
  selector: 'app-order-sales-counter',
  templateUrl: './order-sales-counter.component.html',
  styleUrls: ['./order-sales-counter.component.scss']
})
export class OrderSalesCounterComponent implements OnInit {
  active = 1;

  listStatus: any = [];

  status = 6;

  rowData = [];

  columnDefs = [];

  gridApi: any;

  gridColumnApi: any;

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

  constructor(private matDialog: MatDialog, private orderService: OrderService, private cdr: ChangeDetectorRef) {
    const lst =
      [
        { name: 'Hoàn thành', id: 3 },
      ];

    this.listStatus = lst;

    this.columnDefs = [
      {
        headerName: 'STT',
        field: '',
        suppressMovable: true,
        maxWidth: 60,
        valueGetter: (param: { node: { rowIndex: number; }; }) => {
          return param.node.rowIndex + 1;
        },
      },
      {
        headerName: 'Mã hóa đơn',
        field: 'code',
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#36f',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          cursor: 'pointer',
          'justify-content': 'center',
        },
        onCellClicked: (params: { data: any; }) => {
          return this.openXemChiTiet(params.data);
        },
        flex: 1,
      },
      {
        headerName: 'Nhân Viên',
        field: 'staffAdminDTO.fullname',
        suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'justify-content': 'center',
        },
        flex: 1,
      },
      {
        headerName: 'Ngày Tạo',
        field: 'createDate',
        suppressMovable: true,
        valueFormatter: (params: { data: { createDate: string; }; }) => {
          return formatDateTime(params.data.createDate);
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'justify-content': 'center',
        },
        flex: 1,
      },
      {
        headerName: 'Khách Hàng',
        field: 'customerAdminDTO.fullname',
        suppressMovable: true,
        cellRenderer: params => {
          if (!params.data.customerAdminDTO || !params.data.customerAdminDTO.fullname) {
            return 'Khách Lẻ';
          }
          return params.data.customerAdminDTO.fullname;
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'justify-content': 'center',
        },
        flex: 1,
      },
      {
        headerName: 'Thanh Toán',
        field: 'paymentType',
        valueFormatter: (params: { data: { paymentType: number; }; }) => {
          return params.data.paymentType === 0 ? 'Tiền Mặt' : 'Chuyển Khoản';
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'justify-content': 'center',
        },
        flex: 1,
      }, {
        headerName: 'Tổng Tiền',
        field: 'totalPayment',
        suppressMovable: true,
        valueFormatter: (params: { data: { totalPayment: number; }; }) => {
          return formatMoney(params.data.totalPayment);
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'justify-content': 'center',
        },
        flex: 1,
      }, {
        headerName: 'Trạng Thái',
        field: 'status',
        suppressMovable: true,
        valueGetter: (params: { data: { status: any; }; }) => {
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
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'justify-content': 'center',
        },
        flex: 1,
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
    };

    this.orderService.getAllOrderSalesAdmin(obj).subscribe(res => {
      this.allOrder = res;
      this.rowData = this.allOrder;
    });

    this.cdr.detectChanges();
  }

  tabChanged(event: any) {
    const selectedTabIndex = event.index;
    const selectedTabId = this.listStatus[selectedTabIndex].id;
    this.status = selectedTabId;
    this.getAllOrder();
  }

  openXemChiTiet(dataOrder: any) {
    const dialogref = this.matDialog.open(OrderSalesDetailComponent, {
      width: '150vh',
      height: '90vh',
      data: {
        data: dataOrder,
        staff: this.user
      }
    })
    dialogref.afterClosed().subscribe(res => {
      if (res === 'update-order') {
        this.ngOnInit();
      }
    });
  }

  searchOrder() {
    this.getAllOrder();
    this.cdr.detectChanges();
  }
}
