import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductdetailService } from '../../../service/productdetail.service';
import { ChitietsanphamComponent } from '../chitietsanpham.component';
import { SuaChiTietSanPhamComponent } from '../sua-chi-tiet-san-pham/sua-chi-tiet-san-pham.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chi-tiet-san-pham-action',
  templateUrl: './chi-tiet-san-pham-action.component.html',
  styleUrls: ['./chi-tiet-san-pham-action.component.css']
})

export class ChiTietSanPhamActionComponent implements OnInit {
  params: any;
  rowData = [];

  agInit(params: any): void {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  constructor(
    private matdialog: MatDialog,
    private prddtsv: ProductdetailService,
    private cdr: ChangeDetectorRef,
    private chitietsanphamComponent: ChitietsanphamComponent
  ) { }

  ngOnInit(): void {
  }

  openUpdate() {
    const dialogref = this.matdialog.open(SuaChiTietSanPhamComponent, {
      width: '80vh',
      height: '58vh',
      data: this.params
    });
    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'saveProductDetail') {
        this.chitietsanphamComponent.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
  
  deleteProductDetail(productDetailID?: any) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa',
      text: 'Bạn sẽ không thể hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Thoát',
    }).then((result) => {
      if (result.isConfirmed) {
        productDetailID = this.params.id;
        this.prddtsv.DeleteProductDetail(productDetailID).subscribe(() => {
          this.chitietsanphamComponent.ngOnInit();
          this.cdr.detectChanges();
        });
        Swal.fire(
          'Xóa',
          'Xóa thành công',
          'success'
        );
      }
    });
  }
}
