import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {VoucherService} from '../../service/voucher.service';
import {formatDate, formatDateTime, formatDateYYYY_MM_dd, getFormattedDateCurrent} from '../../util/util';
import {ActionVoucherComponent} from '../voucher/action-voucher/action-voucher.component';
import {VoucherShipService} from "../../service/voucher-ship.service";
import {ActionVoucherShipComponent} from "./action-voucher-ship/action-voucher-ship.component";
import {ToastrService} from "ngx-toastr";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-voucher-ship',
  templateUrl: './voucher-ship.component.html',
  styleUrls: ['./voucher-ship.component.css']
})
export class VoucherShipComponent implements OnInit {
  rowData = [];
  rowData1 = [];
  rowData2 = [];
  role: '';
  loc = '0';
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  dateFromCurrent = null;
  dateToCurrent = null;
  searchResults: any[] = [];
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  constructor(
    private matDialog: MatDialog,
    private apiService: VoucherShipService,
    private cdr: ChangeDetectorRef,
    private  toastr: ToastrService
  ) {
    const currentDate = new Date();
    this.dateFromCurrent = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.dateToCurrent = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    this.columnDefs = [
      {
        headerName: 'Mã',
        field: 'code',
        sortable: true,
        filter: true,
        maxWidth: 150,
      },
      {
        headerName: 'Tên',
        field: 'name',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Ngày bắt đầu',
        field: 'startDate',
        sortable: true,
        filter: true,
        valueGetter: params => {
          return `${formatDateTime(params.data.startDate)}`;
        }
      },
      {
        headerName: 'Ngày kết thúc',
        field: 'endDate',
        sortable: true,
        filter: true,
        valueGetter: params => {
          return `${formatDateTime(params.data.endDate)}`;
        }
      },
      {
        headerName: 'Điều kiện sử dụng',
        field: 'conditionApply',
        sortable: true,
        filter: true,
        maxWidth: 150,
      },
      {
        headerName: 'Sử dụng',
        valueGetter(params) {
          const useVoucher = params.data.useVoucher || 0;
          const quantity = params.data.quantity || 1;
          return `${useVoucher} / ${quantity}`;
        },
        maxWidth: 150,
      },
      {
        headerName: 'Hiển thị',
        field: '',
        cellRenderer: (params) => {
          const isChecked = params.data.idel === 1;
          const useVoucher = params.data.useVoucher || 0;
          const quantity = params.data.quantity || 1;
          const editable = useVoucher !== quantity || params.data.status !== 1;
          const  checkQuantity = useVoucher === quantity || params.data.status === 1;
          return `<div>
      <label class="switch1">
        <input type="checkbox" ${isChecked ? 'checked' : ''} ${checkQuantity ? 'disabled' : ''}>
        <span class="slider round"></span>
      </label>
    </div>`;
        },
        onCellClicked: (params) => {
          const useVoucher = params.data.useVoucher || 0;
          const quantity = params.data.quantity || 1;

          // Bỏ kiểm tra idell nếu usecount bằng quantity
          if (useVoucher === quantity || params.data.status === 1) {
            return;
          }

          // Ngược lại, kiểm tra idell bình thường
          this.checkIsdell(params.node.data, params.node.index);
        },
        editable: false,
        maxWidth: 150,
      },
      {
        headerName: 'Nội dung',
        field: 'description',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Trạng thái',
        field: 'status',
        sortable: true,
        filter: true,
        cellRenderer: this.statusRenderer.bind(this),
        maxWidth: 150,
      },
      {
        headerName: 'Action',
        field: '',
        cellRendererFramework: ActionVoucherShipComponent,
        pinned: 'right',
      },
    ];
  }

  statusRenderer(params) {
    if (params.value === 0) {
      return 'Còn hạn';
    } else if (params.value === 1) {
      return 'Hết hạn';
    } else {
      return 'Không rõ';
    }
  }

  ngOnInit(): void {
      this.apiService.getSomeData().subscribe((response) => {
        this.rowData = response;
        for(let i = 0; i < this.rowData.length; i++) {
          if (new Date(this.rowData[i].endDate) < new Date()) {
            this.apiService.setIdel(this.rowData[i].id).subscribe(res => {
              this.rowData[i] = {
                ...this.rowData[i],
                idel: res.data.idel
              };
            });
          }
        }
        this.searchResults = response;
        console.log(response);
      });
      this.apiService.getVoucherKH().subscribe((response) => {
        this.rowData1 = response;
      });
      this.apiService.getVoucherKKH().subscribe((response) => {
        this.rowData2 = response;
        console.log(response);
      });
      this.role = JSON.parse(localStorage.getItem('role'));
      console.log(this.role + 'hahaahah');
      console.log(localStorage.getItem('role'));
    }
  checkIsdell(data: any, index: any) {
    console.log(data, index);
    if (data.idel === 0) {
      const userConfirmed = confirm('Bạn có muốn kích hoạt voucher freeship không?');
      if (!userConfirmed) {
        return;
      }
      // Truyền dữ liệu thông qua HTTP PUT request
      this.apiService.KichHoat(data.id).subscribe(
        (res) => {
          location.reload();
          this.toastr.success('Kích hoạt thành công');
          console.log(res + 'kích hoạt');
          if (res.data.idCustomer || res.data.idCustomer !== '' || res.data.idCustomer.length > 0){
            this.apiService.sendEmail(res.data).subscribe(result => {
            });
          }
        },
        error => {
          this.toastr.error('Kích hoạt thất bại');
        });
      this.cdr.detectChanges();
    } else {
      const userConfirmed = confirm('Bạn có muốn hủy bỏ kích hoạt voucher freeship không?');
      if (!userConfirmed) {
        return;
      }
      // Truyền dữ liệu thông qua HTTP PUT request
      this.apiService.KichHoat(data.id).subscribe(res => {
          location.reload();
          this.toastr.success('Hủy bỏ kích hoạt thành công');
        },
        error => {
          this.toastr.error('Hủy bỏ kích hoạt thất bại');
        });
    }
    this.cdr.detectChanges();
  }
  Excel() {
    this.apiService.exportExcel().subscribe((data: Blob) => {
      const currentDate = new Date();
      const formattedDate = getFormattedDateCurrent(currentDate);
      const fileName = `DS_VoucherFS_${formattedDate}.xlsx`;
      FileSaver.saveAs(data, fileName);
    });
    this.cdr.detectChanges();
  }
    searchByCustomer(event: any) {
      const searchTerm = event.target.value;
      this.apiService.searchByCustomer(searchTerm).subscribe(
        (data) => {
          this.searchResults = data;
        },
        (error) => {
          console.error(error);
        }
      );
      this.cdr.detectChanges();
    }
    searchByVoucher(event: any) {
      const searchTerm = event.target.value;
      this.apiService.searchByVoucher(searchTerm).subscribe(
        (data) => {
          this.searchResults = data;
        },
        (error) => {
          console.error(error);
        }
      );
      this.cdr.detectChanges();
    }
  searchByDate(obj) {
    const dateRange = {
      fromDate: obj.dateFrom,
      toDate: obj.dateTo
    };

    this.apiService.searchByDate(dateRange).subscribe(
      (data) => {
        this.searchResults = data;
      },
      (error) => {
        console.error('Error occurred during date range search:', error);
        // You can provide a user-friendly error message here if needed
      }
    );
    this.cdr.detectChanges();
  }
  getDater(data) {
    console.log(data);
    if (data.startDate && data.endDate){
      this.dateFromCurrent = data.startDate;
      this.dateToCurrent = data.endDate;
      const obj = {
        dateFrom: formatDate(this.dateFromCurrent),
        dateTo: formatDate(this.dateToCurrent)
      };
      this.searchByDate(obj);
    }else {
      this.ngOnInit();
    }
  }
}

