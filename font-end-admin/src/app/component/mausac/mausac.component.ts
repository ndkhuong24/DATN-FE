import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemMauSacComponent } from './them-mau-sac/them-mau-sac.component';
import { MausacService } from '../../service/mausac.service';
import { MauSacActionComponent } from './mau-sac-action/mau-sac-action.component';
import { getFormattedDateCurrent } from 'src/app/util/util';
import { ImportFileColorComponent } from './import-file-mau-sac/import-file-mau-sac.component';

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

  exportToExcel() {
    this.mssv.exportData().subscribe(response => {
      // Create a new Blob object using the response data
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);

      // Set link attributes
      link.href = url;
      const formattedDate = getFormattedDateCurrent(new Date());
      link.download = `DS_MauSac_${formattedDate}.xlsx`;

      // Append link to the body
      document.body.appendChild(link);

      // Trigger click event to download the file
      link.click();

      // Remove link from the body
      document.body.removeChild(link);
    });
  }

  openPopupImport() {
    this.matdialog.open(ImportFileColorComponent, {
      disableClose: true,
      hasBackdrop: true,
      width: '446px'
    }).afterClosed().subscribe(res => {
      if (res === 'cancel-import') {
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
