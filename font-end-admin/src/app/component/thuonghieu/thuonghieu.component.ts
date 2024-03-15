import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ThemThuongHieuComponent} from "./them-thuong-hieu/them-thuong-hieu.component";
import {BrandService} from "../../service/brand.service";
import {ThuongHieuActionComponent} from './thuong-hieu-action/thuong-hieu-action.component';
import {MauSacActionComponent} from '../mausac/mau-sac-action/mau-sac-action.component';

@Component({
  selector: 'app-thuonghieu',
  templateUrl: './thuonghieu.component.html',
  styleUrls: ['./thuonghieu.component.css']
})
export class ThuonghieuComponent implements OnInit {
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  constructor(private matdialog: MatDialog,
              private brsv: BrandService,
              private cdr: ChangeDetectorRef) {
    this.columnDefs = [
      {
        headerName: 'Tên thương hiệu',
        field: 'name',
        sortable: true,
        filter: true
      },
      {headerName: 'Ngày tạo', field: 'createDate', sortable: true, filter: true},
      {headerName: 'Ngày cập nhật', field: 'updateDate', sortable: true, filter: true},
      {headerName: 'Trạng thái', field: 'status', sortable: true, filter: true, valueGetter: (params) => {
          return params.data.status === 0 ? 'Hoạt động' : 'Ngưng hoạt động';
        }},
      {headerName: 'Chức năng', field: '', cellRendererFramework: ThuongHieuActionComponent, width: 310},
    ];
  }

  ngOnInit(): void {
    this.getAllBrand();
  }
  getAllBrand(){
    this.brsv.getAllBrand().subscribe(res => {
      this.rowData = res;
    });
  }
  openAdd(){
    const dialogref = this.matdialog.open(ThemThuongHieuComponent, {
      width: '60vh',
      height: '60vh'
    });
    dialogref.afterClosed().subscribe(result => {
      if (result === 'addBrand'){
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
}
