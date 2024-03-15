import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {MatDialog} from '@angular/material/dialog';
import {CategoryService} from '../../../service/category.service';
import {DanhmucComponent} from '../danhmuc.component';
import {SuaDanhMucComponent} from '../sua-danh-muc/sua-danh-muc.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-action-category-rederer',
  templateUrl: './action-category-rederer.component.html',
  styleUrls: ['./action-category-rederer.component.css']
})
export class ActionCategoryRedererComponent implements ICellRendererAngularComp, OnInit {

  params: any;
  rowData = [];
  agInit(params: any): void {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }
  constructor(private matdialog: MatDialog,
              private ctsv: CategoryService, private cdr: ChangeDetectorRef,
              private danhmucComponent: DanhmucComponent) { }

  ngOnInit(): void {
  }
  openUpdate(){
    const dialogref = this.matdialog.open(SuaDanhMucComponent, {
      width: '60vh',
      height: '60vh',
      data: this.params
    });
    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'saveCategory') {
        this.danhmucComponent.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
  deleteCategory(category?: any) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa!',
      text: 'Bạn sẽ không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa!'
    }).then((result) => {
      if (result.isConfirmed) {
    category = this.params.id;
    this.ctsv.DeleteCategory(category).subscribe(() => {
      this.danhmucComponent.ngOnInit();
      this.cdr.detectChanges();
    });
    Swal.fire(
          'Xóa!',
          'Xóa thành công',
          'success'
        );
      }
    });
  }
}
