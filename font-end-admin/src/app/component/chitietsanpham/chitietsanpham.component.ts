import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductdetailService } from '../../service/productdetail.service';
import { ChiTietSanPhamActionComponent } from './chi-tiet-san-pham-action/chi-tiet-san-pham-action.component';
import { ThemChiTietSanPhamComponent } from './them-chi-tiet-san-pham/them-chi-tiet-san-pham.component';

@Component({
  selector: 'app-chitietsanpham',
  templateUrl: './chitietsanpham.component.html',
  styleUrls: ['./chitietsanpham.component.css']
})
export class ChitietsanphamComponent implements OnInit {
  rowData = [];
  columnDefs = [];
  headerHeight = 50;
  rowHeight = 40;
  public rowSelection: 'single' | 'multiple' = 'multiple';

  constructor(
    private matdialog: MatDialog,
    private prddtsv: ProductdetailService,
    private cdr: ChangeDetectorRef,
  ) {
    this.columnDefs = [
      {
        headerName: 'Tên sản phẩm',
        field: 'productDTO.name',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Tên màu sắc',
        field: 'colorDTO.name',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Số size',
        field: 'sizeDTO.sizeNumber',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Số lượng',
        field: 'quantity',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Giá cả',
        field: 'price',
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: 'Cổ giày ',
        field: 'shoeCollar',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { shoeCollar: number; }; }) => {
          return params.data.shoeCollar === 0 ? 'Cổ thấp' : 'Cổ cao';
        },
        flex: 1,
      },
      {
        headerName: 'Chức năng',
        field: '',
        cellRendererFramework: ChiTietSanPhamActionComponent,
        flex: 1
      },
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
      width: '80vh',
      height: '58vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'addProductDetail') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
}

