import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActionDiscountComponent} from './action-discount/action-discount.component';
import {DiscountService} from '../../service/discount.service';
import {formatDate, formatDateTime, formatDateYYYY_MM_dd, getFormattedDateCurrent} from '../../util/util';
import {FormControl, FormGroup} from '@angular/forms';
import * as FileSaver from 'file-saver';
import {ToastrService} from "ngx-toastr";
import * as printJS from "print-js";


@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {
  rowData: any = [];
  rowData1: any = [];
  rowData2: any = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  checkedIsdel = false;
  loc = '5';
  export = '0';
  idStaff = '';
  role: '';
  dateFromCurrent = null;
  dateToCurrent = null;
  searchResults: any[] = [];

  constructor(private apiService: DiscountService, private cdr: ChangeDetectorRef,
              private toastr: ToastrService) {
    this.columnDefs = [
      {
        headerName: 'Mã',
        field: 'code',
        sortable: true,
        filter: true,
        minWidth: 70,
        maxWidth: 150,
      },
      {
        headerName: 'Tên',
        field: 'name',
        sortable: true,
        filter: true,
        minWidth: 80,
      },
      {
        headerName: 'Ngày bắt đầu',
        field: 'startDate',
        sortable: true,
        filter: true,
        minWidth: 80,
        valueGetter: params => {
          return `${formatDateTime(params.data.startDate)}`;
        }
      },
      {
        headerName: 'Ngày kết thúc',
        field: 'endDate',
        sortable: true,
        filter: true,
        minWidth: 80,
        valueGetter: params => {
          return `${formatDateTime(params.data.endDate)}`;
        }
      },
      {
        headerName: 'Trạng thái',
        field: 'status',
        sortable: true,
        filter: true,
        cellRenderer: this.statusRenderer.bind(this),
        maxWidth: 100,
      },
      {
        headerName: 'Số lượng sản phẩm đã áp dụng',
        valueGetter: (params) => {
          const useDiscount = params.data.used_count || 0;
          return `${useDiscount}`;
        },
        maxWidth: 200,
      },
      {
        headerName: 'Hiển thị',
        field: '',
        cellRenderer: (params) => {
          const isChecked = params.data.idel === 1;
          const checkStatus = params.data.status === 1;
          return `<div>
      <label class="switch1">
        <input type="checkbox" ${isChecked ? 'checked' : ''} ${checkStatus ? 'disabled' : ''}>
        <span class="slider round"></span>
      </label>
    </div>`;
        },
        onCellClicked: (params) => {
          if (params.data.status === 1) {
            return;
          }
          // Ngược lại, kiểm tra idell bình thường
          if (params.data.idel === 0){
            this.checkIsdell(params.node.data, params.node.index);
          }else{
            this.unCheckIsdell(params.node.data, params.node.index);
          }
        },
        editable: false,
        maxWidth: 150,
      },
      {
        headerName: 'Action',
        field: '',
        cellRendererFramework: ActionDiscountComponent,
        pinned: 'right',
      },
    ];
  }

  // Định nghĩa Cell Renderer ở mức lớp
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
    this.apiService.getDiscountKH().subscribe((response) => {
      this.rowData1 = response;
    });
    this.apiService.getDiscountKKH().subscribe((response) => {
      this.rowData2 = response;
      console.log(response);
    });
    this.role = JSON.parse(localStorage.getItem('role'));
    console.log(this.dateFromCurrent);
    console.log(this.dateToCurrent);
  }

  checkIsdell(data: any, index: any) {
    if (data.idel === 0) {
      const userConfirmed = confirm('Bạn có muốn kích hoạt giảm giá không?');
      if (!userConfirmed) {
        return;
      }
      this.apiService.KichHoat(data.id).subscribe(
        (res) => {
          if (res.status === 'OK') {
            this.toastr.success('Kích hoạt thành công');
            location.reload();
          } else if (res.status === 'BAD_REQUEST') {
            this.toastr.error(res.message);
            location.reload();
          }
        },
        error => {
          this.toastr.error('Kích hoạt thất bại');
        });
      this.cdr.detectChanges();
    }
  }
  unCheckIsdell(data: any, index: any) {
      const userConfirmed = confirm('Bạn có muốn hủy bỏ kích hoạt giảm giá không?');
      if (!userConfirmed) {
        return;
      }
      // Truyền dữ liệu thông qua HTTP PUT request
      this.apiService.setIdel(data.id).subscribe(res => {
          location.reload();
          this.toastr.success('Hủy bỏ kích hoạt thành công');
        },
        error => {
          this.toastr.error('Hủy bỏ kích hoạt thất bại');
        });
      this.cdr.detectChanges();
  }

  searchByCategory(event: any) {
    const searchTerm = event.target.value;
    this.apiService.searchByCategory(searchTerm).subscribe(
      (data) => {
        this.searchResults = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  searchByProduct(event: any) {
    const searchTerm = event.target.value;
    this.apiService.searchByProduct(searchTerm).subscribe(
      (data) => {
        this.searchResults = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  searchByBrand(event: any) {
    const searchTerm = event.target.value;
    this.apiService.searchByBrand(searchTerm).subscribe(
      (data) => {
        this.searchResults = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  searchByDiscount(event: any) {
    const searchTerm = event.target.value;
    this.apiService.searchByDiscount(searchTerm).subscribe(
      (data) => {
        this.searchResults = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  Excel() {
    this.apiService.exportExcel().subscribe((data: Blob) => {
      const currentDate = new Date();
      const formattedDate = getFormattedDateCurrent(currentDate);
      const fileName = `DS_GiamGia_${formattedDate}.xlsx`;
      FileSaver.saveAs(data, fileName);
    });
    this.cdr.detectChanges();
  }

  test(event: any) {
    console.log('data event: ', event);
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
    if (data.startDate && data.endDate) {
      this.dateFromCurrent = data.startDate;
      this.dateToCurrent = data.endDate;
      const obj = {
        dateFrom: formatDate(this.dateFromCurrent),
        dateTo: formatDate(this.dateToCurrent)
      };
      this.searchByDate(obj);
    } else {
      this.ngOnInit();
    }
  }
}
