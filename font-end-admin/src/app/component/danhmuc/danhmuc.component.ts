import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ThemDanhMucComponent} from "./them-danh-muc/them-danh-muc.component";
import {CategoryService} from "../../service/category.service";
import {MatDialog} from "@angular/material/dialog";
import {ActionCategoryRedererComponent} from "./action-category-rederer/action-category-rederer.component";


@Component({
  selector: 'app-danhmuc',
  templateUrl: './danhmuc.component.html',
  styleUrls: ['./danhmuc.component.css']
})
export class DanhmucComponent implements OnInit {
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  constructor(private matdialog: MatDialog,
              private ctsv: CategoryService,
              private cdr: ChangeDetectorRef
  ) {
    this.columnDefs = [
      {headerName: 'Tên', field: 'name', sortable: true, filter: true, width: 220},
      {headerName: 'Ngày bắt đầu', field: 'createDate', sortable: true, filter: true, width: 250},
      {headerName: 'Ngày Sửa ', field: 'updateDate', sortable: true, filter: true, width: 250},
      {headerName: 'Trạng thái', field: 'status', sortable: true, filter: true, valueGetter: (params) => {
          return params.data.status === 0 ? 'Hoạt động' : 'Ngưng hoạt động';
        }, width: 250},
      {headerName: 'Chức năng', field: '', cellRendererFramework: ActionCategoryRedererComponent, width: 140}];
  }

  ngOnInit(): void {
    this.getCategory();
  }
  getCategory() {
    this.ctsv.getAllCategory().subscribe(data => {
      this.rowData = data;
    });
  }
  openAdd(){
    const dialogRef = this.matdialog.open(ThemDanhMucComponent, {
      width: '60vh',
      height: '60vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'addCategory') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

}
