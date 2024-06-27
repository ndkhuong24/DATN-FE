import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StaffService } from '../../service/staff.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionStaffComponent } from './action-staff/action-staff.component';
import { AddStaffComponent } from './add-staff/add-staff.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  // animal: string;
  // listStaff: UsersDTO[] = [];

  // currentPage = 1;
  // active = 1;
  // listStatus: any = [];
  // status = 6;
  // rowData;
  // columnDefs = [];
  // gridApi;
  // gridColumnApi;
  // user: any = {
  //   id: null,
  //   code: null,
  //   fullname: '',
  //   phone: '',
  //   email: '',
  // };
  // modelSearch: any = {
  //   code: null,
  //   dateFrom: null,
  //   dateTo: null
  // };

  // allOrder: any = [];

  rowData1 = [];
  rowData2 = [];
  columnDefs = [];

  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';

  searchStaff: any;

  constructor(
    private matDialog: MatDialog,
    private staffService: StaffService,
    private cdr: ChangeDetectorRef
  ) {
    // const lst =
    //   [
    //     { name: 'Hoàn thành', id: 3 },
    //   ];
    // this.listStatus = lst;
    this.columnDefs = [
      {
        headerName: 'Mã nhân viên',
        field: 'code',
        sortable: true,
        filter: true,
        flex: 1
      },
      {
        headerName: 'Họ và tên',
        field: 'fullname',
        sortable: true,
        filter: true,
        flex: 1.25
      },
      {
        headerName: 'Ngày sinh',
        field: 'birthday',
        sortable: true,
        filter: true,
        flex: 1,
        // valueGetter: (params: { data: { birthday: string; }; }) => this.formatDate(params.data.birthday)
      },
      {
        headerName: 'Giới tính',
        field: 'gender',
        sortable: true,
        filter: true,
        flex: 0.75
      },
      {
        headerName: 'Địa chỉ',
        field: 'description',
        sortable: true,
        filter: true,
        flex: 1.5
      }, {
        headerName: 'Số điện thoại',
        field: 'phone',
        sortable: true,
        filter: true,
        flex: 1
      }, {
        headerName: 'Trạng Thái',
        field: 'idel',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { idel: number; }; }) => params.data.idel === 0 ? 'Hoạt động' : 'Đã xóa',
        flex: 1,
      },
      {
        headerName: 'Action',
        field: '',
        cellRendererFramework: ActionStaffComponent,
        pinned: 'right',
        maxWidth: 125,
      },
    ];
  }

  finbyStaffLike() {
    if (this.searchStaff === '') {
      this.getAllStart();
    } else {
      this.staffService.findByCodeOrPhoneLike(this.searchStaff).subscribe((response) => {
        this.rowData1 = response.filter((staff: { idel: number; }) => staff.idel === 0);
        this.rowData2 = response.filter((staff: { idel: number; }) => staff.idel === 1);
      })
    }
  }

  ngOnInit(): void {
    this.getAllStart();
  }

  getAllStart() {
    this.staffService.getAllStaff().subscribe((response) => {
      this.rowData1 = response.filter((staff: { idel: number; }) => staff.idel === 0);
      this.rowData2 = response.filter((staff: { idel: number; }) => staff.idel === 1);
    })
  }

  openAdd() {
    const dialogref = this.matDialog.open(AddStaffComponent, {
      width: '100vh',
      height: '80vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addStaff') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  // private formatDate(dateStr: string): string {
  //   if (!dateStr) return '';
  //   const date = new Date(dateStr);
  //   return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  // }

  // tabChanged(event: any) {
  //   const selectedTabIndex = event.index;
  //   const selectedTabId = this.listStatus[selectedTabIndex].id;
  //   this.status = selectedTabId;
  //   this.getAllOrder();
  // }

  // openXemChiTiet(dataOrder) {
  //   this.matDialog.open(DetailStaffComponent, {
  //     width: '150vh',
  //     height: '90vh',
  //     data: {
  //       data: dataOrder,
  //       staff: this.user
  //     }
  //   }).afterClosed().subscribe(res => {
  //     if (res === 'update-order') {
  //       this.ngOnInit();
  //     }
  //   });
  // }

  // searchOrder() {
  //   console.log(this.modelSearch);
  //   this.getAllOrder();
  //   this.cdr.detectChanges();
  // }
}
