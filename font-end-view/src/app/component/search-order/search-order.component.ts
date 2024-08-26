import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UtilService } from '../../util/util.service';
import { OrderService } from '../../service/order.service';
import { formatMoney, padZero } from '../../util/util';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NoteOrderComponent } from '../order/note-order/note-order.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-order',
  templateUrl: './search-order.component.html',
  styleUrls: ['./search-order.component.css']
})
export class SearchOrderComponent implements OnInit {
  codeOrderSearch: any;
  order: any = null;
  rowData = [];
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  address = [];
  noteOrder: string = null;
  infoCustomer: any;

  constructor(
    private route: ActivatedRoute,
    public utilService: UtilService,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private toaService: ToastrService,
    private toastr: ToastrService,
    private matDiaLog: MatDialog,
  ) {

    this.rowData = [];
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
        flex: 1,
        cellRenderer: (params: { data: { productDetailDTO: { productDTO: { imageURL: any; name: any; }; }; }; }) => {
          return `
          <div>
            <img width="60px" height="60px" src="${params.data.productDetailDTO.productDTO.imageURL}">
            <span class="productName" title="${params.data.productDetailDTO.productDTO.name}">${params.data.productDetailDTO.productDTO.name}</span>
          </div>
        `;
        },
      },
      {
        headerName: 'Phân Loại',
        field: '',
        suppressMovable: true,
        flex: 1,
        cellRenderer: (params: { data: { productDetailDTO: { colorDTO: { name: any; }; sizeDTO: { sizeNumber: any; }; }; }; }) => {
          return `<div style="height: 30px"><span style="font-weight: bold">Color:</span> ${params.data.productDetailDTO.colorDTO.name}</div>
            <div style="height: 30px"><span style="font-weight: bold">Size: </span> ${params.data.productDetailDTO.sizeDTO.sizeNumber}</div>`;
        }
      },
      {
        headerName: 'Số lượng',
        field: 'quantity',
        suppressMovable: true,
        flex: 1,
        valueFormatter: (params: { data: { quantity: any; }; }) => {
          return padZero(params.data.quantity);
        },
      },
      {
        headerName: 'Giá tiền',
        field: 'price',
        suppressMovable: true,
        flex: 1,
        valueFormatter: (params: { data: { price: number; }; }) => {
          return formatMoney(params.data.price);
        },
      },
      {
        headerName: 'Thành tiền',
        field: '',
        suppressMovable: true,
        flex: 1,
        valueFormatter: (params: { data: { price: number; quantity: number; }; }) => {
          return formatMoney(params.data.price * params.data.quantity);
        },
      }
    ];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.codeOrderSearch = params['code'] || null;
      if (this.codeOrderSearch) {
        this.searchOrder();
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  searchOrder() {
    this.order = null;
    this.address = [];
    this.rowData = [];
    if (!this.codeOrderSearch) {
      this.toaService.warning('Vui lòng nhập mã đơn hàng cần tra cứu');
      return;
    }
    this.orderService.traCuuOrder({ code: this.codeOrderSearch }).subscribe(res => {
      if (res.status === 'OK') {
        this.order = res.data;
        this.address = res.data.addressReceived.split(',');
        this.rowData = res.data.orderDetailDTOList;
        this.toaService.success('Tra cứu đơn hàng thành công');
      } else {
        this.toaService.warning(res.message);
      }
    },
      error => {
        this.toaService.error('Tra cứu đơn hàng thất bại');
      }
    );
  }

  xacNhan() {
    this.matDiaLog.open(NoteOrderComponent, {
      width: '90vh',
      height: '32vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        const storedUsers = localStorage.getItem('customer');
        if (storedUsers) {
          this.infoCustomer = JSON.parse(storedUsers);
        }

        this.noteOrder = res.data.note;
        const obj = {
          id: this.order.id,
          idStaff: this.order.idStaff,
          idCustomer: this.infoCustomer ? this.infoCustomer.id : null,
          note: res.data.note
        };

        this.orderService.completeOrder(obj).subscribe(result => {
          if (result.status === 'OK') {
            Swal.fire('Đã nhận hàng thành công');
            this.ngOnInit();
            this.cdr.detectChanges();
          } else {
            this.toastr.error(result.message, 'Thông báo', {
              positionClass: 'toast-top-right'
            });
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  huy() {
    this.matDiaLog.open(NoteOrderComponent, {
      width: '90vh',
      height: '32vh',
    }).afterClosed().subscribe(res => {
      if (res.event === 'close-note') {
        // Lấy thông tin khách hàng từ localStorage
        const storedUsers = localStorage.getItem('customer');

        if (storedUsers) {
          this.infoCustomer = JSON.parse(storedUsers);
        }

        // Lấy ghi chú đơn hàng từ kết quả đóng của dialog
        this.noteOrder = res.data.note;

        // Tạo đối tượng chứa thông tin đơn hàng để gửi yêu cầu hủy
        const obj = {
          id: this.order.id,
          idStaff: this.order.idStaff,
          idCustomer: this.infoCustomer ? this.infoCustomer.id : null,
          note: this.noteOrder
        };

        // Gửi yêu cầu hủy đơn hàng
        this.orderService.cancelOrderView(obj).subscribe(result => {
          if (result.status === 'OK') {
            // Hiển thị thông báo thành công và làm mới dữ liệu
            Swal.fire('Đã hủy đơn hàng thành công');
            this.ngOnInit();
            this.cdr.detectChanges();

            // Điều hướng đến trang tra cứu đơn hàng
            window.location.href = `http://localhost:4000/tra-cuu-don-hang`;
          } else {
            // Hiển thị thông báo lỗi nếu hủy không thành công
            this.toastr.error(result.message, 'Thông báo', {
              positionClass: 'toast-top-right'
            });
          }

          // Cập nhật lại giao diện sau khi xử lý xong
          this.cdr.detectChanges();
        });
      }
    });
  }
}
