import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemSanPhamComponent } from './them-san-pham/them-san-pham.component';
import { SuaSanPhamComponent } from './sua-san-pham/sua-san-pham.component';
import { ProductService } from '../../service/product.service';
import { ActionVoucherComponent } from '../voucher/action-voucher/action-voucher.component';
import * as FileSaver from 'file-saver';
import { formatDateTime, formatMoney, getFormattedDateCurrent } from '../../util/util';
import { ImportFileComponent } from './import-file/import-file.component';
import { SanPhamActionComponent } from './san-pham-action/san-pham-action.component';
import { ImageRendererComponent } from './image-renderer/image-renderer.component';
import { MaterialpostService } from '../../service/materialpost.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sanpham',
  templateUrl: './sanpham.component.html',
  styleUrls: ['./sanpham.component.css']
})
export class SanphamComponent implements OnInit {
  rowData = [];
  columnDefs;
  headerHeight = 50;
  rowHeight = 40;
  products: any[];
  selectedProductId: number;
  productDetails: any[];
  public rowSelection: 'single' | 'multiple' = 'multiple'; // Chọn nhiều dòng
  rowExpansion: boolean = false;
  searchProduct: string;
  productId: number;
  status0Products: any[];
  status1Products: any[];
  data = [
    {
      id: 1,
      name: 'Abc',
      email: 'abc@mail.com',
      isExpand: false,
      address: [
        {
          add1: 'Delhi',
          add2: 'Bangalore',
        }
      ]
    },
    {
      id: 2,
      name: 'Xyz',
      email: 'xyz@mail.com',
      isExpand: false,
      address: [
        {
          add1: 'Mumbai',
          add2: 'Pune',
        }
      ]
    },
    {
      id: 3,
      name: 'ijk',
      email: 'ijk@mail.com',
      isExpand: false,
      address: [
        {
          add1: 'Chennai',
          add2: 'Bangalore',
        }
      ]
    },
    {
      id: 4,
      name: 'def',
      email: 'def@mail.com',
      isExpand: false,
      address: [
        {
          add1: 'Kolkata',
          add2: 'Hyderabad',
        }
      ]
    }
  ];


  constructor(private matdialog: MatDialog,
    private spsv: ProductService, private changeDetectorRef: ChangeDetectorRef,
    private cdr: ChangeDetectorRef,
    private router: Router) {
  }
  ngOnInit(): void {
    this.spsv.getAllProductAll().subscribe(products => {
      this.products = products.map(p => ({
        ...p,
        isExpand: false
      }));
      this.status0Products = this.products.filter(p => p.status === 0);
      this.status1Products = this.products.filter(p => p.status === 1);

      console.log('Product: ', this.products);
    });
  }
  activateProduct(productId: number) {
    this.spsv.activateProduct(productId).subscribe(
      () => {
        // Xử lý thành công
        this.ngOnInit();
        this.cdr.detectChanges();
        console.log('Sản phẩm đã được kích hoạt.');
      },
      (error) => {
        // Xử lý lỗi
        console.error('Lỗi khi kích hoạt sản phẩm:', error);
      }
    );
  }

  deactivateProduct(productId: number) {
    this.spsv.deactivateProduct(productId).subscribe(
      () => {
        // Xử lý thành công
        this.ngOnInit();
        this.cdr.detectChanges();
        console.log('Sản phẩm đã được ngừng hoạt động.');
      },
      (error) => {
        // Xử lý lỗi
        console.error('Lỗi khi ngừng hoạt động sản phẩm:', error);
      }
    );
  }
  finbyProductLike() {
    if (this.searchProduct === '') {
      this.spsv.getAllProductAll().subscribe(
        data => {
          this.products = data.map(p => {
            return {
              ...p,
              isExpand: false
            };
          });
          this.status0Products = this.products.filter(p => p.status === 0);
          this.status1Products = this.products.filter(p => p.status === 1);
        }
      );
    } else {
      this.spsv.searchProductNameOrCode(this.searchProduct).subscribe(
        data => {
          this.products = data.map(p => {
            return {
              ...p,
              isExpand: false
            };
          });
          this.status0Products = this.products.filter(p => p.status === 0);
          this.status1Products = this.products.filter(p => p.status === 1);
        }
      );
    }

  }

  exportData() {
    this.spsv.exportExcelProduct().subscribe((data: Blob) => {
      const currentDate = new Date();
      const formattedDate = getFormattedDateCurrent(currentDate);
      const fileName = `DS_SanPham_${formattedDate}.xlsx`;
      FileSaver.saveAs(data, fileName);
    });
    this.changeDetectorRef.detectChanges();
  }

  openPopupImport() {
    this.matdialog.open(ImportFileComponent, {
      data: null,
      disableClose: true,
      hasBackdrop: true,
      width: '446px'
    }).afterClosed().subscribe(res => {
      if (res === 'cancel-import') {
        this.ngOnInit();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  productExpand(i: any) {
    this.rowExpansion = !this.rowExpansion;
    if (this.rowExpansion) {
      //call api lấy productDetai thuộc product
    }
  }

}

