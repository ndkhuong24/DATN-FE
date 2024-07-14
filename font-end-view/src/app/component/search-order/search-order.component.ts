import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UtilService } from '../../util/util.service';
import { OrderService } from '../../service/order.service';
import { formatMoney, padZero } from '../../util/util';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    public utilService: UtilService,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private toaService: ToastrService
  ) {

    this.rowData = [];
    this.columnDefs = [
      {
        headerName: 'STT',
        field: '',
        suppressMovable: true,
        // minWidth: 60,
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
        // console.log(this.order)
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
}
