import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemDeGiayComponent } from './them-de-giay/them-de-giay.component';
import { SoleService } from '../../service/sole.service';
import { DeGiayActionComponent } from './de-giay-action/de-giay-action.component';

@Component({
  selector: 'app-degiay',
  templateUrl: './degiay.component.html',
  styleUrls: ['./degiay.component.css'],
})
export class DegiayComponent implements OnInit {
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  constructor(
    private matdialog: MatDialog,
    private slsv: SoleService,
    private cdr: ChangeDetectorRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Chiều cao đế',
        field: 'soleHeight',
        sortable: true,
        filter: true,
        width: 125,
      },
      {
        headerName: 'Chất liệu đế',
        field: 'soleMaterial',
        sortable: true,
        filter: true,
        width: 125,
      },
      {
        headerName: 'Ngày bắt đầu',
        field: 'createDate',
        sortable: true,
        filter: true,
        width: 125,
      },
      {
        headerName: 'Ngày sửa ',
        field: 'updateDate',
        sortable: true,
        filter: true,
        width: 125,
      },
      {
        headerName: 'Mô tả',
        field: 'description',
        sortable: true,
        filter: true,
        with: 350,
      },
      {
        headerName: 'Trạng thái',
        field: 'status',
        sortable: true,
        filter: true,
        valueGetter: (params) => {
          return params.data.status === 0 ? 'Hoạt động' : 'Ngừng hoạt động';
        },
        width: 125,
      },
      {
        headerName: 'Chức năng',
        field: '',
        cellRendererFramework: DeGiayActionComponent,
        width: 125,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllSole();
  }
  getAllSole() {
    this.slsv.getAllSole().subscribe((result) => {
      this.rowData = result;
    });
  }

  openAdd() {
    const dialogref = this.matdialog.open(ThemDeGiayComponent, {
      width: '65vh',
      height: '75vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addSole') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
}
