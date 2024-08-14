import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemChatLieuComponent } from './them-chat-lieu/them-chat-lieu.component';
import { MaterialpostService } from '../../service/materialpost.service';
import { ChatlieuActionComponent } from './chat-lieu-action/chat-lieu-action.component';
import { getFormattedDateCurrent } from 'src/app/util/util';
import { ImportFileMaterialComponent } from './import-file-chat-lieu/import-file-chat-lieu.component';

@Component({
  selector: 'app-chatlieu',
  templateUrl: './chatlieu.component.html',
  styleUrls: ['./chatlieu.component.css'],
})
export class ChatlieuComponent implements OnInit {
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  constructor(
    private matdialog: MatDialog,
    private mtsv: MaterialpostService,
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
        cellRendererFramework: ChatlieuActionComponent,
        flex: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.getMaterial();
  }

  getMaterial() {
    this.mtsv.getAllMaterial().subscribe((data) => {
      this.rowData = [...data];
    });
  }

  openAdd() {
    const dialogref = this.matdialog.open(ThemChatLieuComponent, {
      width: '65vh',
      height: '47vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addMaterial') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  exportToExcel() {
    this.mtsv.exportData().subscribe(response => {
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
    this.matdialog.open(ImportFileMaterialComponent, {
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
