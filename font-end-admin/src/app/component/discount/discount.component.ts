import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActionDiscountComponent } from './action-discount/action-discount.component';
import { DiscountService } from '../../service/discount.service';
import { formatDate, formatDateTime, formatDateYYYY_MM_dd, getFormattedDateCurrent } from '../../util/util';
import { FormControl, FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { ToastrService } from "ngx-toastr";
import * as printJS from "print-js";
import { MatDialog } from '@angular/material/dialog';
import { CreatDiscountComponent } from './creat-discount/creat-discount.component';


@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})

export class DiscountComponent implements OnInit {
  public rowSelection: 'single' | 'multiple' = 'multiple';
  rowData = [];
  rowData1 = [];
  rowData2 = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;

  loc = '5';
  idStaff = '';
  role: '';

  dateFromCurrent = null;
  dateToCurrent = null;
  searchResults: any[] = [];

  constructor(
    private disCountService: DiscountService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private matDialog: MatDialog,
  ) {
    this.columnDefs = [
      {
        headerName: 'Mã',
        field: 'code',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Tên',
        field: 'name',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Ngày bắt đầu',
        field: 'startDate',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { startDate: string } }) => {
          return `${formatDateTime(params.data.startDate)}`;
        },
        flex: 1,
      },
      {
        headerName: 'Ngày kết thúc',
        field: 'endDate',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { endDate: string } }) => {
          return `${formatDateTime(params.data.endDate)}`;
        },
        flex: 1,
      },
      {
        headerName: 'Trạng thái',
        field: 'status',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { status: number } }) => {
          return params.data.status === 0 ? 'Còn hạn' : 'Hết hạn';
        },
        flex: 1,
      },
      {
        headerName: 'Số lượng sản phẩm đã áp dụng',
        valueGetter: (params: { data: { used_count: number; }; }) => {
          const useDiscount = params.data.used_count || 0;
          return `${useDiscount}`;
        },
        flex: 1,
      },
      {
        headerName: 'Hiện thị',
        field: 'idel',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { idel: number } }) => {
          return params.data.idel === 1 ? 'Đang hiển thị' : 'Không hiển thị';
        },
        flex: 1,
      },
      {
        headerName: 'Action',
        field: '',
        cellRendererFramework: ActionDiscountComponent,
        pinned: 'right',
        maxWidth: 100,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllDiscount();
    this.getAllDiscountKH();
    this.getAllDiscountKKH();
    this.role = JSON.parse(localStorage.getItem('role'));
  }

  getAllDiscount() {
    this.disCountService.getAllDiscount().subscribe((response) => {
      this.rowData = response;

      for (let i = 0; i < this.rowData.length; i++) {
        if (new Date(this.rowData[i].endDate) < new Date()) {
          this.disCountService.setIdel(this.rowData[i].id).subscribe(res => {
            this.rowData[i] = {
              ...this.rowData[i],
              idel: res.data.idel
            };
          });
        }
      }
      this.searchResults = response;
    });
  }

  getAllDiscountKH() {
    this.disCountService.getDiscountKH().subscribe((response) => {
      this.rowData1 = response;
    });
  }

  getAllDiscountKKH() {
    this.disCountService.getDiscountKKH().subscribe((response) => {
      this.rowData2 = response;
    });
  }

  checkIsdell(data: any, index: any) {
    // if (data.idel === 0) {
    //   const userConfirmed = confirm('Bạn có muốn kích hoạt giảm giá không?');
    //   if (!userConfirmed) {
    //     return;
    //   }
    //   this.disCountService.KichHoat(data.id).subscribe(
    //     (res) => {
    //       if (res.status === 'OK') {
    //         this.toastr.success('Kích hoạt thành công');
    //         location.reload();
    //       } else if (res.status === 'BAD_REQUEST') {
    //         this.toastr.error(res.message);
    //         location.reload();
    //       }
    //     },
    //     error => {
    //       this.toastr.error('Kích hoạt thất bại');
    //     });
    //   this.cdr.detectChanges();
    // }
  }

  unCheckIsdell(data: any, index: any) {
    // const userConfirmed = confirm('Bạn có muốn hủy bỏ kích hoạt giảm giá không?');
    // if (!userConfirmed) {
    //   return;
    // }
    // // Truyền dữ liệu thông qua HTTP PUT request
    // this.disCountService.setIdel(data.id).subscribe(res => {
    //   location.reload();
    //   this.toastr.success('Hủy bỏ kích hoạt thành công');
    // },
    //   error => {
    //     this.toastr.error('Hủy bỏ kích hoạt thất bại');
    //   });
    // this.cdr.detectChanges();
  }

  searchByCategory(event: any) {
    console.log(event)
    // const searchTerm = event.target.value;
    // this.disCountService.searchByCategory(searchTerm).subscribe(
    //   (data) => {
    //     this.searchResults = data;
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }

  searchByProduct(event: any) {
    console.log(event)
    // const searchTerm = event.target.value;
    // this.disCountService.searchByProduct(searchTerm).subscribe(
    //   (data) => {
    //     this.searchResults = data;
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }

  searchByBrand(event: any) {
    console.log(event)
    // const searchTerm = event.target.value;
    // this.disCountService.searchByBrand(searchTerm).subscribe(
    //   (data) => {
    //     this.searchResults = data;
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }

  searchByDiscount(event: any) {
    console.log(event)
    // const searchTerm = event.target.value;
    // this.disCountService.searchByDiscount(searchTerm).subscribe(
    //   (data) => {
    //     this.searchResults = data;
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }

  searchByDate(obj: any) {
    console.log(obj)
    // const dateRange = {
    //   fromDate: obj.dateFrom,
    //   toDate: obj.dateTo
    // };

    // this.disCountService.searchByDate(dateRange).subscribe(
    //   (data) => {
    //     this.searchResults = data;
    //   },
    //   (error) => {
    //     console.error('Error occurred during date range search:', error);
    //     // You can provide a user-friendly error message here if needed
    //   }
    // );
    // this.cdr.detectChanges();
  }

  getDater(data: any) {
    console.log(data);
    // if (data.startDate && data.endDate) {
    //   this.dateFromCurrent = data.startDate;
    //   this.dateToCurrent = data.endDate;
    //   const obj = {
    //     dateFrom: formatDate(this.dateFromCurrent),
    //     dateTo: formatDate(this.dateToCurrent)
    //   };
    //   this.searchByDate(obj);
    // } else {
    //   this.ngOnInit();
    // }
  }

  openAdd() {
    const dialogref = this.matDialog.open(CreatDiscountComponent, {
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
