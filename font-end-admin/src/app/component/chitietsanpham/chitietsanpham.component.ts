import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../service/product.service';
import { SanPhamActionComponent } from '../sanpham/san-pham-action/san-pham-action.component';
import { ProductdetailService } from '../../service/productdetail.service';
import { ChiTietSanPhamActionComponent } from './chi-tiet-san-pham-action/chi-tiet-san-pham-action.component';
import { ThemDanhMucComponent } from '../danhmuc/them-danh-muc/them-danh-muc.component';
import { ThemChiTietSanPhamComponent } from './them-chi-tiet-san-pham/them-chi-tiet-san-pham.component';

@Component({
  selector: 'app-chitietsanpham',
  templateUrl: './chitietsanpham.component.html',
  styleUrls: ['./chitietsanpham.component.css']
})
export class ChitietsanphamComponent implements OnInit {
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  constructor(private matdialog: MatDialog,
    private prddtsv: ProductdetailService,
    private cdr: ChangeDetectorRef) {
    this.columnDefs = [
      {
        headerName: 'Tên sản phẩm',
        field: 'idProduct',
        sortable: true,
        filter: true,
        width: 130, valueGetter: params => {
          return params.data.productDTO.name;
        }
      },
      {
        headerName: 'Tên màu sắc', field: 'idColor', sortable: true, filter: true, valueGetter: params => {
          return params.data.colorDTO.name;
        }
      },
      {
        headerName: 'Số size', field: 'idSize', sortable: true, filter: true, valueGetter: params => {
          return params.data.sizeDTO.sizeNumber;
        }
      },
      { headerName: 'Số lượng', field: 'quantity', sortable: true, filter: true },
      {
        headerName: 'Cổ giày ', field: 'shoeCollar', sortable: true, filter: true, valueGetter: (params) => {
          return params.data.shoeCollar === 0 ? 'Cổ thấp' : 'Cổ cao';
        }
      },
      { headerName: 'Chức năng', field: '', cellRendererFramework: ChiTietSanPhamActionComponent, height: 50 },
    ];
  }

  ngOnInit(): void {
    this.getProductDetail();
  }
  getProductDetail() {
    this.prddtsv.getAllProductDetail().subscribe(res => {
      this.rowData = res;
    });
  }
  openAdd() {
    const dialogRef = this.matdialog.open(ThemChiTietSanPhamComponent, {
      width: '60vh',
      height: '60vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'addProductDetail') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

}
