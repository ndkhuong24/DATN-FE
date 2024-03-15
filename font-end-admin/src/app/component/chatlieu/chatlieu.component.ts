import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ThemChatLieuComponent} from './them-chat-lieu/them-chat-lieu.component';
import {SuaChatLieuComponent} from './sua-chat-lieu/sua-chat-lieu.component';

import {MaterialpostService} from '../../service/materialpost.service';
import {ActionRendererComponent} from './action-renderer/action-renderer.component';

@Component({
  selector: 'app-chatlieu',
  templateUrl: './chatlieu.component.html',
  styleUrls: ['./chatlieu.component.css']
})
export class ChatlieuComponent implements OnInit {
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  constructor(private matdialog: MatDialog,
              private mtsv: MaterialpostService, private cdr: ChangeDetectorRef) {
    this.columnDefs = [
      {
        headerName: 'Tên',
        field: 'name',
        sortable: true,
        filter: true
      },
      {headerName: 'Ngày bắt đầu', field: 'createDate', sortable: true, filter: true},
      {headerName: 'Ngày Sửa ', field: 'updateDate', sortable: true, filter: true},
      {headerName: 'Mô tả', field: 'description', sortable: true, filter: true},
      {
        headerName: 'Trạng thái', field: 'status', sortable: true, filter: true, valueGetter: (params) => {
          return params.data.status === 0 ? 'Hoạt động' : 'Ngưng hoạt động';
        }
      },
      {headerName: 'Chức năng', field: '', cellRendererFramework: ActionRendererComponent, width: 110},
    ];
  }

  ngOnInit(): void {
    this.getMaterial();
  }

  getMaterial() {
    this.mtsv.getAllMaterial().subscribe(data => {
      this.rowData = [...data];
    });
  }

  openAdd() {
    const dialogref = this.matdialog.open(ThemChatLieuComponent, {
      width: '65vh',
      height: '65vh',
    });
    dialogref.afterClosed().subscribe(result => {
      if (result === 'addMaterial') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
}
