import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemKichCoComponent } from './them-kich-co/them-kich-co.component';
import { SizeService } from '../../service/size.service';
import { KichCoActionComponent } from './kich-co-action/kich-co-action.component';

@Component({
  selector: 'app-kichco',
  templateUrl: './kichco.component.html',
  styleUrls: ['./kichco.component.css'],
})
export class KichcoComponent implements OnInit {
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  constructor(
    private matdialog: MatDialog,
    private szsv: SizeService,
    private cdr: ChangeDetectorRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Số kích cỡ',
        field: 'sizeNumber',
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
        headerName: 'Ngày cập nhật',
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
        cellRendererFramework: KichCoActionComponent,
        flex: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllSize();
  }

  getAllSize() {
    this.szsv.getAllSize().subscribe((result) => {
      this.rowData = result;
    });
  }

  openAdd() {
    const dialogref = this.matdialog.open(ThemKichCoComponent, {
      width: '65vh',
      height: '37vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addSize') {
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
