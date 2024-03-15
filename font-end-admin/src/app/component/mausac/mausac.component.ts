import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ThemMauSacComponent} from './them-mau-sac/them-mau-sac.component';
import {MausacService} from '../../service/mausac.service';
import {MauSacActionComponent} from './mau-sac-action/mau-sac-action.component';
import {ActionCategoryRedererComponent} from '../danhmuc/action-category-rederer/action-category-rederer.component';

@Component({
  selector: 'app-mausac',
  templateUrl: './mausac.component.html',
  styleUrls: ['./mausac.component.css']
})
export class MausacComponent implements OnInit {
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  constructor(private matdialog: MatDialog,
              private mssv: MausacService,
              private cdr: ChangeDetectorRef) {
    this.columnDefs = [
      {
        headerName: 'Tên màu',
        field: 'name',
        sortable: true,
        filter: true,
        width: 300
      },
      {
        headerName: 'Mã màu',
        field: 'code',
        sortable: true,
        filter: true,
        width: 230
      },
      {headerName: 'Ngày tạo', field: 'createDate', sortable: true, filter: true, width: 350},
      {headerName: 'Chức năng', field: '', cellRendererFramework: MauSacActionComponent, width: 230},
    ];
  }

  ngOnInit(): void {
    this.getAllColor();
  }
  getAllColor(){
    this.mssv.getAllMauSac().subscribe(res => {
      this.rowData = res;
    });
  }
  openAdd(){
    const dialogref = this.matdialog.open(ThemMauSacComponent, {
      width: '65vh',
      height: '45vh'
    });
    dialogref.afterClosed().subscribe(result => {
      if (result === 'addColor'){
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
}
