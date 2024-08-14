import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemThuongHieuComponent } from './them-thuong-hieu/them-thuong-hieu.component';
import { BrandService } from '../../service/brand.service';
import { ThuongHieuActionComponent } from './thuong-hieu-action/thuong-hieu-action.component';
import { getFormattedDateCurrent } from 'src/app/util/util';
import { ImportFileBrandComponent } from './import-file-thuong-hieu/import-file-thuong-hieu.component';

@Component({
  selector: 'app-thuonghieu',
  templateUrl: './thuonghieu.component.html',
  styleUrls: ['./thuonghieu.component.css'],
})
export class ThuonghieuComponent implements OnInit {
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  constructor(
    private matdialog: MatDialog,
    private brandService: BrandService,
    private cdr: ChangeDetectorRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Tên thương hiệu',
        field: 'name',
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
        cellRendererFramework: ThuongHieuActionComponent,
        flex: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllBrand();
  }

  getAllBrand() {
    this.brandService.getAllBrand().subscribe((res) => {
      this.rowData = res;
    });
  }

  openAdd() {
    const dialogref = this.matdialog.open(ThemThuongHieuComponent, {
      width: '60vh',
      height: '35vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addBrand') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  exportToExcel() {
    this.brandService.exportData().subscribe(response => {
      // Create a new Blob object using the response data
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);

      // Set link attributes
      link.href = url;
      const formattedDate = getFormattedDateCurrent(new Date());
      link.download = `DS_ThuongHieu_${formattedDate}.xlsx`;

      // Append link to the body
      document.body.appendChild(link);

      // Trigger click event to download the file
      link.click();

      // Remove link from the body
      document.body.removeChild(link);
    });
  }

  openPopupImport() {
    this.matdialog.open(ImportFileBrandComponent, {
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
