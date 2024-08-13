import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemDeGiayComponent } from './them-de-giay/them-de-giay.component';
import { SoleService } from '../../service/sole.service';
import { DeGiayActionComponent } from './de-giay-action/de-giay-action.component';
import { getFormattedDateCurrent } from 'src/app/util/util';
import { ImportFileSoleComponent } from './import-file-de-giay/import-file-de-giay.component';

@Component({
  selector: 'app-degiay',
  templateUrl: './degiay.component.html',
  styleUrls: ['./degiay.component.css'],
})
export class DegiayComponent implements OnInit {
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';
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
        flex: 1,
      },
      {
        headerName: 'Chất liệu đế',
        field: 'soleMaterial',
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
        headerName: 'Ngày sửa ',
        field: 'updateDate',
        sortable: true,
        filter: true,
        flex: 1,
        valueGetter: (params: { data: { updateDate: string; }; }) => this.formatDate(params.data.updateDate)
      },
      {
        headerName: 'Mô tả',
        field: 'description',
        sortable: true,
        filter: true,
        flex: 1,
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
        cellRendererFramework: DeGiayActionComponent,
        flex: 1,
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
      height: '60vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addSole') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  exportToExcel() {
    this.slsv.exportData().subscribe(response => {
      // Create a new Blob object using the response data
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);

      // Set link attributes
      link.href = url;
      const formattedDate = getFormattedDateCurrent(new Date());
      link.download = `DS_DeGiay_${formattedDate}.xlsx`;

      // Append link to the body
      document.body.appendChild(link);

      // Trigger click event to download the file
      link.click();

      // Remove link from the body
      document.body.removeChild(link);
    });
  }

  openPopupImport() {
    this.matdialog.open(ImportFileSoleComponent, {
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
