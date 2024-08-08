import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderDetailService } from '../../../service/order-detail.service';
import { padZero } from '../../../util/util';
import { OrderService } from '../../../service/order.service';
import { ToastrService } from 'ngx-toastr';
import { NoteOrderComponent } from '../note-order/note-order.component';
import { UtilService } from '../../../util/util.service';
import { VoucherService } from 'src/app/service/voucher.service';
import { VoucherShipService } from 'src/app/service/voucher-ship.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})

export class OrderDetailComponent implements OnInit {
  rowData = [];
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  status: any;
  totalQuantity: number = 0;
  listOrderHistoryAdmin: any = [];
  listOrderHistoryView: any = [];

  voucherReduce: number = 0;
  voucherShipReduce: number = 0;

  constructor(
    private orderDetailService: OrderDetailService,
    public matRef: MatDialogRef<OrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private matDiaLog: MatDialog,
    public utilService: UtilService,
  ) {
    this.columnDefs = [
      {
        headerName: 'STT',
        field: '',
        suppressMovable: true,
        maxWidth: 60,
        valueGetter: (param: { node: { rowIndex: number; }; }) => {
          return param.node.rowIndex + 1;
        }
      },
      {
        headerName: 'Tên Sản phẩm',
        field: '',
        suppressMovable: true,
        cellRenderer: (params: { data: { productDetailDTO: { productDTO: { imageURL: any; name: any; }; }; }; }) => {
          return `
          <div>
            <img width="60px" height="60px" src="${params.data.productDetailDTO.productDTO.imageURL}" alt="">
            <span class="productName" title="${params.data.productDetailDTO.productDTO.name}">${params.data.productDetailDTO.productDTO.name}</span>
          </div>
          `;
        },
        flex: 1,
      },
      {
        headerName: 'Phân Loại',
        field: '',
        suppressMovable: true,
        cellRenderer: (params: { data: { productDetailDTO: { colorDTO: { name: any; }; sizeDTO: { sizeNumber: any; }; }; }; }) => {
          return `<div style="height: 30px"><span style="font-weight: bold">Color:</span> ${params.data.productDetailDTO.colorDTO.name}</div>
            <div style="height: 30px"><span style="font-weight: bold">Size: </span> ${params.data.productDetailDTO.sizeDTO.sizeNumber}</div>`;
        },
        flex: 1,
      },
      {
        headerName: 'Số lượng',
        field: 'quantity',
        suppressMovable: true,
        valueFormatter: (params: { data: { quantity: any; }; }) => {
          return padZero(params.data.quantity);
        },
        flex: 1,
      },
      {
        headerName: 'Giá tiền',
        field: 'price',
        suppressMovable: true,
        valueFormatter: (params) => {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(params.data.price)
            .replace('₫', '') + 'đ';
        },
        flex: 1,
      },
      {
        headerName: 'Thành tiền',
        field: '',
        suppressMovable: true,
        valueFormatter: (params) => {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(params.data.price * params.data.quantity)
            .replace('₫', '') + 'đ';
        },
        flex: 1,

      }
    ];
    this.status = this.data.data.status;
  }

  ngOnInit(): void {
    this.orderDetailService.getAllOrderDetailByOrder(this.data.data.id).subscribe(res => {
      this.rowData = res.orderDetail;
      this.listOrderHistoryAdmin = res.orderHistoryAdmin;
      this.listOrderHistoryView = res.orderHistoryView;
      this.totalQuantity = this.rowData.reduce((total, orderDetail) => total + (orderDetail.quantity || 0), 0);
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cancelOrder() {
    this.matDiaLog.open(NoteOrderComponent, {
      width: '90vh',
      height: '32vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        const obj = {
          id: this.data.data.id,
          idCustomer: this.data.customer.id,
          note: res.data.note
        };
        this.orderService.cancelOrderView(obj).subscribe(res => {
          this.toastr.success('Hủy đơn hàng thành công', 'Thông báo', {
            positionClass: 'toast-top-right'
          });
          this.cdr.detectChanges();
          this.matRef.close('update-order');
        });
      }
    });
  }

  xacNhan() {
    this.matDiaLog.open(NoteOrderComponent, {
      width: '90vh',
      height: '32vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        const obj = {
          id: this.data.data.id,
          idStaff: this.data.data.idStaff,
          idCustomer: this.data.customer.id,
          note: res.data.note
        };

        this.orderService.completeOrder(obj).subscribe(result => {
          if (result.status === 'OK') {
            Swal.fire('Đã nhận hàng thành công');
            this.cdr.detectChanges();
          } else {
            this.toastr.error(result.message, 'Thông báo', {
              positionClass: 'toast-top-right'
            });
          }
          this.cdr.detectChanges();
          this.matRef.close('update-order');
        });
      }
    });
  }
}
