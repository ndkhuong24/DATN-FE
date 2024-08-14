import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ThemDanhMucComponent } from './them-danh-muc/them-danh-muc.component';
import { CategoryService } from '../../service/category.service';
import { MatDialog } from '@angular/material/dialog';
import { DanhMucActionComponent } from './danh-muc-action/danh-muc-action.component'
import { getFormattedDateCurrent } from 'src/app/util/util';
import { ImportFileCategoryComponent } from './import-file-danh-muc/import-file-danh-muc.component';

@Component({
  selector: 'app-danhmuc',
  templateUrl: './danhmuc.component.html',
  styleUrls: ['./danhmuc.component.css'],
})

export class DanhmucComponent implements OnInit {
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  constructor(
    private matdialog: MatDialog,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Tên',
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
        cellRendererFramework: DanhMucActionComponent,
        flex: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory() {
    this.categoryService.getAllCategory().subscribe((data) => {
      this.rowData = data;
    });
  }

  openAdd() {
    const dialogRef = this.matdialog.open(ThemDanhMucComponent, {
      width: '60vh',
      height: '35vh',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'addCategory') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  exportToExcel() {
    this.categoryService.exportData().subscribe(response => {
      // Create a new Blob object using the response data
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);

      // Set link attributes
      link.href = url;
      const formattedDate = getFormattedDateCurrent(new Date());
      link.download = `DS_DanhMuc_${formattedDate}.xlsx`;

      // Append link to the body
      document.body.appendChild(link);

      // Trigger click event to download the file
      link.click();

      // Remove link from the body
      document.body.removeChild(link);
    });
  }

  openPopupImport() {
    this.matdialog.open(ImportFileCategoryComponent, {
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
