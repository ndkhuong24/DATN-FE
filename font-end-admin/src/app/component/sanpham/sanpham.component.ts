import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/service/product.service';
import { ThemSanPhamComponent } from './them-san-pham/them-san-pham.component';
import { SanPhamActionComponent } from './san-pham-action/san-pham-action.component';

@Component({
  selector: 'app-sanpham',
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css'],
})

export class SanphamComponent implements OnInit {
  status0Products = [];
  status1Products = [];
  columnDefs = [];

  headerHeight = 50;
  rowHeight = 100;

  public rowSelection: 'single' | 'multiple' = 'multiple';

  constructor(
    private matdialog: MatDialog,
    private productsService: ProductService,
    private cdr: ChangeDetectorRef
  ) {
    this.columnDefs = [
      {
        headerName: 'Ảnh',
        field: 'imageURL',
        cellRenderer: (params: { data: { imageURL: any; }; }) => `<img height="100px" src="${params.data.imageURL}">`,
        flex: 1
      },
      {
        headerName: 'Mã',
        field: 'code',
        sortable: true,
        filter: true,
        flex: 1
      },
      {
        headerName: 'Tên',
        field: 'name',
        sortable: true,
        filter: true,
        flex: 1
      },
      {
        headerName: 'SL SPCT',
        field: 'productDetailAdminDTOList.size', // Original field for reference
        valueGetter: (params: { data: { productDetailAdminDTOList: string | any[]; }; }) => params.data.productDetailAdminDTOList ? params.data.productDetailAdminDTOList.length : 0,
        sortable: true,
        filter: true,
        flex: 1
      },
      {
        headerName: 'Hãng',
        field: 'brandAdminDTO.name',
        sortable: true,
        filter: true,
        flex: 1
      },
      // {
      //   headerName: 'Chất liệu',
      //   field: 'materialAdminDTO.name',
      //   sortable: true,
      //   filter: true,
      //   flex: 1
      // },
      // {
      //   headerName: 'Đế giày',
      //   field: 'soleAdminDTO',
      //   valueGetter: (params: { data: { soleAdminDTO: { soleHeight: any; soleMaterial: any; }; }; }) => {
      //     if (params.data.soleAdminDTO) {
      //       return `${params.data.soleAdminDTO.soleHeight} - ${params.data.soleAdminDTO.soleMaterial}`;
      //     }
      //     return '';
      //   },
      //   sortable: true,
      //   filter: true,
      //   flex: 1
      // },
      {
        headerName: 'Danh mục',
        field: 'categoryAdminDTO.name',
        sortable: true,
        filter: true,
        flex: 1
      },
      {
        headerName: 'Trạng thái',
        field: 'status',
        sortable: true,
        filter: true,
        valueGetter: (params: { data: { status: number; }; }) => params.data.status === 0 ? 'Hoạt động' : 'Ngừng hoạt động',
        flex: 1
      },
      {
        headerName: 'Chức năng',
        field: '',
        cellRendererFramework: SanPhamActionComponent,
        pinned: 'right',
        maxWidth: 100,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllProduct();
    // var userjson = localStorage.getItem("users");
    // var users = JSON.parse(userjson);
    // var role = users.role;
    // console.log(role);
  }

  getAllProduct() {
    this.productsService.getAllProduct().subscribe((res) => {
      this.status0Products = res.filter((product: { status: number; }) => product.status === 0);
      this.status1Products = res.filter((product: { status: number; }) => product.status === 1);
    })
  }

  openAdd() {
    const dialogref = this.matdialog.open(ThemSanPhamComponent, {
      width: '250vh',
      height: '100vh',
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result === 'addProduct') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
}