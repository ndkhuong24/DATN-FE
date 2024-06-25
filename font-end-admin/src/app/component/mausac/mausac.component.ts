import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemMauSacComponent } from './them-mau-sac/them-mau-sac.component';
import { MausacService } from '../../service/mausac.service';
import { MauSacActionComponent } from './mau-sac-action/mau-sac-action.component';

@Component({
  selector: 'app-mausac',
  templateUrl: './mausac.component.html',
  styleUrls: ['./mausac.component.css'],
})
export class MausacComponent implements OnInit {
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  constructor(
    private matdialog: MatDialog,
    private mssv: MausacService,
    private cdr: ChangeDetectorRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Tên màu',
        field: 'name',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Mã màu',
        field: 'code',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Ngày tạo',
        field: 'createDate',
        sortable: true,
        filter: true,
        flex: 1,
        valueGetter: (params: { data: { createDate: string; }; }) => this.formatDate(params.data.createDate)
      },
      {
        headerName: 'Ngày sửa',
        field: 'updateDate',
        sortable: true,
        filter: true,
        flex: 1,
        valueGetter: (params: { data: { updateDate: string; }; }) => this.formatDate(params.data.updateDate)
      },
      {
        headerName: 'Trạng thái',
        field: 'status',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { status: number; }; }) => {
          return params.data.status === 0 ? 'Hoạt động' : 'Ngừng hoạt động';
        },
        flex: 1,
      },
      {
        headerName: 'Chức năng',
        field: '',
        cellRendererFramework: MauSacActionComponent,
        flex: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllColor();
  }

  getAllColor() {
    this.mssv.getAllMauSac().subscribe((res) => {
      this.rowData = res;
    });
  }
  openAdd() {
    const dialogref = this.matdialog.open(ThemMauSacComponent, {
      width: '65vh',
      height: '47vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addColor') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
}
