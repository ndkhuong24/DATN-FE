import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionVoucherComponent } from './action-voucher/action-voucher.component';
import { VoucherService } from 'src/app/service/voucher.service';
import { formatDate, formatDateTime } from '../../util/util';
import { CreatVoucherComponent } from './creat-voucher/creat-voucher.component';

@Component({
  selector: 'app-bangvoucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
})
export class VoucherComponent implements OnInit {
  public rowSelection: 'single' | 'multiple' = 'multiple';
  rowData = [];
  rowData1 = [];
  rowData2 = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  loc = '0';
  idStaff = '';
  role: '';
  dateFromCurrent = null;
  dateToCurrent = null;
  searchResults: any[] = [];
  voucher: any = {
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    reducedValue: '',
    voucherType: '',
    conditionApply: 0,
    quantity: 0,
    limitCustomer: '',
    customerAdminDTOList: '',
    appy: '',
    optionCustomer: '',
  };
  gridOptions: any;

  constructor(
    private matDialog: MatDialog,
    private voucherService: VoucherService,
    private cdr: ChangeDetectorRef,
  ) {
    const currentDate = new Date();

    this.dateFromCurrent = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    this.dateToCurrent = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    this.columnDefs = [
      {
        headerName: 'Mã',
        field: 'code',
        sortable: true,
        filter: true,
        maxWidth: 125,
      },
      {
        headerName: 'Tên',
        field: 'name',
        sortable: true,
        filter: true,
        maxWidth: 125,
      },
      {
        headerName: 'Ngày bắt đầu',
        field: 'startDate',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { startDate: string } }) => {
          return `${formatDateTime(params.data.startDate)}`;
        },
        maxWidth: 150,
      },
      {
        headerName: 'Ngày kết thúc',
        field: 'endDate',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { endDate: string } }) => {
          return `${formatDateTime(params.data.endDate)}`;
        },
        maxWidth: 150,
      },
      {
        headerName: 'Điều kiện',
        field: 'conditionApply',
        sortable: true,
        filter: true,
        maxWidth: 125,
      },
      {
        headerName: 'Sử dụng',
        valueGetter(params: {
          data: { useVoucher: number; quantity: number };
        }) {
          const useVoucher = params.data.useVoucher || 0;
          const quantity = params.data.quantity || 1;
          return `${useVoucher} / ${quantity}`;
        },
        maxWidth: 125,
      },
      {
        headerName: 'Hiện thị',
        field: 'idel',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { idel: number } }) => {
          return params.data.idel === 1 ? 'Đang hiển thị' : 'Không hiển thị';
        },
        maxWidth: 125,
      },
      {
        headerName: 'Nội dung',
        field: 'description',
        sortable: true,
        filter: true,
        maxWidth: 125,
      },
      {
        headerName: 'Trạng thái',
        field: 'status',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { status: number } }) => {
          return params.data.status === 0 ? 'Còn hạn' : 'Hết hạn';
        },
        maxWidth: 125,
      },
      {
        headerName: 'Action',
        field: '',
        cellRendererFramework: ActionVoucherComponent,
        pinned: 'right',
        maxWidth: 100,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllVoucher();
    this.getVoucherKH();
    this.getVoucherKKH();
    this.role = JSON.parse(localStorage.getItem('role'));
  }

  getVoucherKKH() {
    this.voucherService.getVoucherKH().subscribe((response) => {
      this.rowData1 = response;
    });
  }

  getVoucherKH() {
    this.voucherService.getVoucherKKH().subscribe((response) => {
      this.rowData2 = response;
    });
  }

  getAllVoucher() {
    this.voucherService.getAllVoucher().subscribe((response) => {
      this.rowData = response;

      for (let i = 0; i < this.rowData.length; i++) {
        if (new Date(this.rowData[i].endDate) < new Date()) {
          this.voucherService.setIdel(this.rowData[i].id).subscribe((res) => {
            this.rowData[i] = {
              ...this.rowData[i],
              idel: res.data.idel,
            };
          });
        }
      }

      this.searchResults = response;
    });
  }

  searchByCustomer(event: any) {
    const searchTerm = event.target.value;
    this.voucherService.searchByCustomer(searchTerm).subscribe(
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
    this.voucherService.searchByVoucher(searchTerm).subscribe(
      (data) => {
        this.searchResults = data;
      },
      (error) => {
        console.error(error);
      }
    );
    this.cdr.detectChanges();
  }

  searchByDate(obj: { dateFrom: any; dateTo: any }) {
    const dateRange = {
      fromDate: obj.dateFrom,
      toDate: obj.dateTo,
    };

    this.voucherService.searchByDate(dateRange).subscribe(
      (data) => {
        this.searchResults = data;
      },
      (error) => {
        console.error('Error occurred during date range search:', error);
      }
    );
    this.cdr.detectChanges();
  }

  getDater(data: { startDate: any; endDate: any }) {
    if (data.startDate && data.endDate) {
      this.dateFromCurrent = data.startDate;
      this.dateToCurrent = data.endDate;
      const obj = {
        dateFrom: formatDate(this.dateFromCurrent),
        dateTo: formatDate(this.dateToCurrent),
      };
      this.searchByDate(obj);
    } else {
      this.ngOnInit();
    }
  }

  openAdd() {
    const dialogref = this.matDialog.open(CreatVoucherComponent, {
      width: '250vh',
      height: '98vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addVoucher') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
}
