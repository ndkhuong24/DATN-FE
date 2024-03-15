import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../service/product.service';
import {SanPhamActionComponent} from '../sanpham/san-pham-action/san-pham-action.component';
import {ProductdetailService} from '../../service/productdetail.service';
import {ChiTietSanPhamActionComponent} from './chi-tiet-san-pham-action/chi-tiet-san-pham-action.component';
import {ThemDanhMucComponent} from '../danhmuc/them-danh-muc/them-danh-muc.component';
import {ThemChiTietSanPhamComponent} from './them-chi-tiet-san-pham/them-chi-tiet-san-pham.component';

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
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
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
      {headerName: 'Tên màu sắc', field: 'idColor', sortable: true, filter: true, width: 150, valueGetter: params => {
          return params.data.colorDTO.name;
        }},
      {headerName: 'Số size', field: 'idSize', sortable: true, filter: true, width: 100, valueGetter: params => {
          return params.data.sizeDTO.sizeNumber;
        }},
      {headerName: 'Số lượng', field: 'quantity', sortable: true, filter: true, width: 150},
      // {headerName: 'Ngày tạo ', field: 'createDate', sortable: true, filter: true, width: 150},
      // {headerName: 'Ngày cập nhật', field: 'updateDate', sortable: true, filter: true, width: 150},
      {headerName: 'Cổ giày ', field: 'shoeCollar', sortable: true, filter: true, width: 150, valueGetter: (params) => {
          return params.data.shoeCollar === 0 ? 'Cổ thấp' : 'Cổ cao';
        }},
      // {headerName: 'Tên thương hiệu ', field: 'idBrand', sortable: true, filter: true, valueGetter: params => {
      //     return params.data.brandAdminDTO.name;
      //   }, width: 150},
      // {headerName: 'Tên danh mục ', field: 'idCategory', sortable: true, filter: true, valueGetter: params => {
      //     return params.data.categoryAdminDTO.name;
      //   }, width: 150},
      // {headerName: 'Tên chất liệu ', field: 'idMaterial', sortable: true, filter: true, valueGetter: params => {
      //     return params.data.materialAdminDTO.name;
      //   }, width: 150},
      // {headerName: 'Mô tả ', field: 'description', sortable: true, filter: true},
      // {headerName: 'Trạng thái', field: 'status', sortable: true, filter: true, valueGetter: (params) => {
      //     return params.data.status === 0 ? 'Hoạt động' : 'Ngưng hoạt động';
      //   }, width: 150},
      // {headerName: 'Chiều cao đế', field: 'idSole', sortable: true, filter: true, valueGetter: params => {
      //     return params.data.soleAdminDTO.soleHeight;
      //   }, width: 110},
      {headerName: 'Chức năng', field: '', cellRendererFramework: ChiTietSanPhamActionComponent, width: 110, height: 50},
    ]; }

  ngOnInit(): void {
    this.getProductDetail();
  }
  getProductDetail() {
    this.prddtsv.getAllProductDetail().subscribe(res => {
      this.rowData = res;
    });
  }
  openAdd(){
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
