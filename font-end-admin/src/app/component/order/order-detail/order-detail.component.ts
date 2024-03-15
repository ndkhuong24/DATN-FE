import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {formatMoney, padZero} from '../../../util/util';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OrderDetailService} from '../../../service/order-detail.service';
import {OrderService} from '../../../service/order.service';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {NoteOrderComponent} from '../note-order/note-order.component';
import {UtilService} from '../../../util/util.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  rowData: any;
  columnDefs: any;
  gridApi;
  gridColumnApi;
  status: any;
  totalQuantity: number = 0;
  noteOrder: string = null;
  listOrderHistoryAdmin: any = [];
  listOrderHistoryView: any = [];

  constructor(private orderDetailService: OrderDetailService, public matRef: MatDialogRef<OrderDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private orderService: OrderService, private cdr: ChangeDetectorRef, private toastr: ToastrService,
              private matDiaLog: MatDialog, public utilService: UtilService) {
    this.rowData = [];
    this.columnDefs = [
      {
        headerName: 'STT',
        field: '',
        suppressMovable: true,
        minWidth: 60,
        maxWidth: 60,
        valueGetter: param => {
          return param.node.rowIndex + 1;
        }
      },
      {
        headerName: 'Tên Sản phẩm',
        field: '',
        suppressMovable: true,
        cellRenderer: params => {
          return `<div>
        <img width="60px" height="60px" src="${params.data.productDetailDTO.productDTO.imagesDTOList[0].imageName}" alt="">
        <span class="productName" title="${params.data.productDetailDTO.productDTO.name}">${params.data.productDetailDTO.productDTO.name}</span>
</div>`;
        },
      },
      {
        headerName: 'Phân Loại',
        field: '',
        suppressMovable: true,
        cellRenderer: params => {
          return `<div style="height: 30px"><span style="font-weight: bold">Color:</span> ${params.data.productDetailDTO.colorDTO.name}</div>
            <div style="height: 30px"><span style="font-weight: bold">Size: </span> ${params.data.productDetailDTO.sizeDTO.sizeNumber}</div>`;
        }
      },
      {
        headerName: 'Số lượng',
        field: 'quantity',
        suppressMovable: true,
        valueFormatter: params => {
          return padZero(params.data.quantity);
        },
      },
      {
        headerName: 'Gía tiền',
        field: 'price',
        suppressMovable: true,
        valueFormatter: params => {
          return formatMoney(params.data.price);
        },
      },
      {
        headerName: 'Thành tiền',
        field: '',
        suppressMovable: true,
        valueFormatter: params => {
          return formatMoney(params.data.price * params.data.quantity);
        },
      }
    ];
    this.status = this.data.data.status;
  }

  ngOnInit(): void {
    // console.log(this.data);
    console.log(this.data.data);
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
      height: '38vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        this.noteOrder = res.data.note;
        const obj = {
          id: this.data.data.id,
          idStaff: this.data.staff.id,
          note: res.data.note
        };
        this.orderService.cancelOrder(obj).subscribe(result => {
          if (result.status === 'OK') {
            this.toastr.success('Hủy đơn hàng thành công!', 'Thông báo', {
              positionClass: 'toast-top-right'
            });
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

  xacNhanOrder() {
    this.matDiaLog.open(NoteOrderComponent, {
      width: '90vh',
      height: '38vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        this.noteOrder = res.data.note;
        const obj = {
          id: this.data.data.id,
          idStaff: this.data.staff.id,
          note: res.data.note
        };
        this.orderService.progressingOrder(obj).subscribe(result => {
          if (result.status === 'OK') {
            this.toastr.success('Xác nhận thành công!', 'Thông báo', {
              positionClass: 'toast-top-right'
            });
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

  giaoHangOrder() {
    this.matDiaLog.open(NoteOrderComponent, {
      width: '90vh',
      height: '38vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        this.noteOrder = res.data.note;
        const obj = {
          id: this.data.data.id,
          idStaff: this.data.staff.id,
          note: res.data.note
        };
        this.orderService.shipOrder(obj).subscribe(result => {
          if (result.status === 'OK') {
            this.toastr.success('Đơn hàng bắt đầu được giao!', 'Thông báo', {
              positionClass: 'toast-top-right'
            });
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

  hoanThanhOrder() {
    this.matDiaLog.open(NoteOrderComponent, {
      width: '90vh',
      height: '38vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        this.noteOrder = res.data.note;
        const obj = {
          id: this.data.data.id,
          idStaff: this.data.staff.id,
          note: res.data.note
        };
        this.orderService.completeOrder(obj).subscribe(result => {
          if (result.status === 'OK') {
            this.toastr.success('Đơn hàng đã hoàn thành!', 'Thông báo', {
              positionClass: 'toast-top-right'
            });
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

  boLoOrder() {
    this.matDiaLog.open(NoteOrderComponent, {
      width: '90vh',
      height: '38vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        this.noteOrder = res.data.note;
        const obj = {
          id: this.data.data.id,
          idStaff: this.data.staff.id,
          note: res.data.note
        };
        this.orderService.missedOrder(obj).subscribe(res => {
          this.toastr.success('Bỏ lỡ đơn hàng thành công!', 'Thông báo', {
            positionClass: 'toast-top-right'
          });
          this.cdr.detectChanges();
          this.matRef.close('update-order');
        });
      }
    });
  }

  sendEmailFromCustomer() {
    Swal.fire({
      title: 'Bạn có muốn gửi Email đến khách hàng ?',
      text: '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderDetailService.sendEmailFromCustomer(this.data.data).subscribe(res => {
          this.toastr.success('Gửi email đến khách hàng thành công!');
        });
      }
    });
  }
}
