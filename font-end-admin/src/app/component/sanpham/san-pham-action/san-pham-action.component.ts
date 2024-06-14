import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SuaSanPhamComponent } from '../sua-san-pham/sua-san-pham.component';
import { MatDialog } from '@angular/material/dialog';
import { SanphamComponent } from '../sanpham.component';
import { ProductService } from '../../../service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-san-pham-action',
  templateUrl: './san-pham-action.component.html',
  styleUrls: ['./san-pham-action.component.css']
})

export class SanPhamActionComponent implements OnInit {
  status0Products = [];
  status1Products = [];

  constructor(
    private matdialog: MatDialog,
    private productsService: ProductService,
    private cdr: ChangeDetectorRef,
    private sanphamComponent: SanphamComponent
  ) { }

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct() {
    this.productsService.getAllProduct().subscribe((res) => {
      this.status0Products = res.filter(product => product.status === 0);
      this.status1Products = res.filter(product => product.status === 1);
    })
  }

  params: any;
  rowData = [];

  agInit(params: any) {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  openUpdate() {
    const dialogref = this.matdialog.open(SuaSanPhamComponent, {
      width: '100%',
      height: '100vh',
      data: this.params,
    });
    dialogref.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'saveProduct') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  clickReset(id: number): void {
    Swal.fire({
      title: 'Bạn có chắc muốn cập nhật trạng thái không?',
      text: 'Bạn sẽ không thể hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Thoát',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.GetProduct(id).subscribe((req1) => {
          if (req1.data.status === 0) {
            this.productsService.deactivateProduct(req1.data.id).subscribe(
              () => {
                this.sanphamComponent.ngOnInit();
                this.cdr.detectChanges();
                Swal.fire('Cập nhật', 'Cập nhật thành công', 'success');
              }
            )
          }else{
            this.productsService.activateProduct(req1.data.id).subscribe(
              () => {
                this.sanphamComponent.ngOnInit();
                this.cdr.detectChanges();
                Swal.fire('Cập nhật', 'Cập nhật thành công', 'success');
              }
            )
          }
        })
        // this.productsService.getProductStatus(id).subscribe(
        //   (status) => {
        //     if (status === 0) {
        //       this.productsService.deactivateProduct(id).subscribe(
        //         () => {
        //           // Refresh component after update
        //           this.ngOnInit();
        //           this.cdr.detectChanges();
        //           Swal.fire('Cập nhật', 'Cập nhật thành công', 'success');
        //         },
        //         (error) => {
        //           console.error('Đã xảy ra lỗi khi cập nhật', error);
        //           Swal.fire('Lỗi', 'Đã xảy ra lỗi khi cập nhật', 'error');
        //         }
        //       );
        //     } else {
        //       this.productsService.activateProduct(id).subscribe(
        //         () => {
        //           // Refresh component after update
        //           this.ngOnInit();
        //           this.cdr.detectChanges();
        //           Swal.fire('Cập nhật', 'Cập nhật thành công', 'success');
        //         },
        //         (error) => {
        //           console.error('Đã xảy ra lỗi khi cập nhật', error);
        //           Swal.fire('Lỗi', 'Đã xảy ra lỗi khi cập nhật', 'error');
        //         }
        //       );
        //     }
        //   },
        //   (error) => {
        //     console.error('Đã xảy ra lỗi khi kiểm tra trạng thái', error);
        //     Swal.fire('Lỗi', 'Đã xảy ra lỗi khi kiểm tra trạng thái', 'error');
        //   }
        // );
      }
    });
  }

}

// export class SanPhamActionComponent implements ICellRendererAngularComp, OnInit {
//   idProduct: any;
//   rowData = [];
//   params: any;
//   constructor(private matdialog: MatDialog,
//     private prdsv: ProductService,
//     private cdr: ChangeDetectorRef,
//     private sanphamComponent: SanphamComponent) {
//   }

//   ngOnInit(): void {
//     this.getAllProduct();
//   }
//   deleteProduct(product?: any) {
//     Swal.fire({
//       title: 'Bạn có chắc muốn xóa!',
//       text: 'Bạn sẽ không thể hoàn tác!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Xóa!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         product = this.params.id;
//         this.prdsv.DeleteProduct(product).subscribe(() => {
//           this.sanphamComponent.ngOnInit();
//           this.cdr.detectChanges();
//         });
//         Swal.fire(
//           'Xóa!',
//           'Xóa thành công',
//           'success'
//         );
//       }
//     });
//   }
//   openUpdate() {
//     const dialogref = this.matdialog.open(SuaSanPhamComponent, {
//       width: '100vh',
//       height: '70vh',
//       data: this.params
//     });
//     dialogref.afterClosed().subscribe(result => {
//       if (result === 'saveProduct') {
//         this.sanphamComponent.ngOnInit();
//         this.cdr.detectChanges();
//       }
//     });
//   }
//   getAllProduct() {
//     this.prdsv.getAllProduct().subscribe(res => {
//       this.rowData = res;
//     });
//   }

//   agInit(params: any): void {
//     this.params = params.data;
//     this.idProduct = params.data.id;
//   }

//   refresh(): boolean {
//     return false;
//   }

// }
