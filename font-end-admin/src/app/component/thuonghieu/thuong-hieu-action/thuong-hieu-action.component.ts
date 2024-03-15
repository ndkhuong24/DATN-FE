import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SuaThuongHieuComponent} from '../sua-thuong-hieu/sua-thuong-hieu.component';
import {MatDialog} from '@angular/material/dialog';
import {BrandService} from '../../../service/brand.service';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ThuonghieuComponent} from '../thuonghieu.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-thuong-hieu-action',
  templateUrl: './thuong-hieu-action.component.html',
  styleUrls: ['./thuong-hieu-action.component.css']
})
export class ThuongHieuActionComponent implements ICellRendererAngularComp, OnInit {

  rowData = [];
  params: any;
  agInit(params: any) {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  constructor(private  matdialog: MatDialog,
              private brsv: BrandService,
              private cdr: ChangeDetectorRef,
              private thuonghieuComponent: ThuonghieuComponent) { }

  ngOnInit(): void {
  }
  openUpdate(){
    const dialogRef = this.matdialog.open(SuaThuongHieuComponent, {
      width: '60vh',
      height: '60vh',
      data: this.params
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saveBrand'){
        this.thuonghieuComponent.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
  deleteBrand(brand?: any) {
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
    brand = this.params.id;
    this.brsv.DeleteBrand(brand).subscribe(() => {
      this.thuonghieuComponent.ngOnInit();
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
