import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { formatDate, formatDateTime } from '../../util/util';
import { VoucherShipService } from '../../service/voucher-ship.service';
import { ActionVoucherShipComponent } from './action-voucher-ship/action-voucher-ship.component';
import { CreatVoucherShipComponent } from './creat-voucher-ship/creat-voucher-ship.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-voucher-ship',
  templateUrl: './voucher-ship.component.html',
  styleUrls: ['./voucher-ship.component.css'],
})
export class VoucherShipComponent implements OnInit {
  rowData = [];
  rowData1 = [];
  rowData2 = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  searchResults: any[] = [];

  role: 'ADMIN' | 'USER' | 'STAFF';
  loc = '0';
  dateFromCurrent = null;
  dateToCurrent = null;

  public rowSelection: 'single' | 'multiple' = 'multiple';

  constructor(
    private matDialog: MatDialog,
    private voucherShipService: VoucherShipService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
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
        headerName: 'Điều kiện sử dụng',
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
        cellRendererFramework: ActionVoucherShipComponent,
        pinned: 'right',
        maxWidth: 100,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllVoucherShip();
    this.getAllVoucherShipKH();
    this.getAllVoucherShipKKH();

    var userjson = localStorage.getItem("users");
    var users = JSON.parse(userjson);
    this.role = users.role;
  }

  getAllVoucherShip() {
    this.voucherShipService.getAllVoucher().subscribe((response) => {
      this.rowData = response;

      for (let i = 0; i < this.rowData.length; i++) {
        if (new Date(this.rowData[i].endDate) < new Date()) {
          this.voucherShipService
            .setIdel(this.rowData[i].id)
            .subscribe((res) => {
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

  getAllVoucherShipKH() {
    this.voucherShipService.getVoucherKH().subscribe((response) => {
      this.rowData1 = response;
    });
  }

  getAllVoucherShipKKH() {
    this.voucherShipService.getVoucherKKH().subscribe((response) => {
      this.rowData2 = response;
    });
  }

  searchByCustomer(event: any) {
    const searchTerm = event.target.value;
    this.voucherShipService.searchByCustomer(searchTerm).subscribe(
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
    this.voucherShipService.searchByVoucher(searchTerm).subscribe(
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

    this.voucherShipService.searchByDate(dateRange).subscribe(
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

  openAdd(): void {
    if (this.role === 'ADMIN') {
      const dialogRef = this.matDialog.open(CreatVoucherShipComponent, {
        width: '250vh',
        height: '98vh',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'addVoucherFreeShip') {
          this.ngOnInit();
          this.cdr.detectChanges();
        }
      });
    } else if (this.role === 'STAFF') {
      this.toastr.error('Bạn không có quyền thêm voucher freeship', 'Lỗi'); // Show error message
    }
  }

  // openAdd() {
  //   const dialogref = this.matDialog.open(CreatVoucherShipComponent, {
  //     width: '250vh',
  //     height: '98vh',
  //   });
  //   dialogref.afterClosed().subscribe((result) => {
  //     if (result === 'addVoucherFreeShip') {
  //       this.ngOnInit();
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }
}
