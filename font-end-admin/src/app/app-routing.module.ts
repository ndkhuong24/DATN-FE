import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { DanhmucComponent } from './component/danhmuc/danhmuc.component';
import { SanphamComponent } from './component/sanpham/sanpham.component';
import { OrderComponent } from './component/order/order.component';
import { OderProcessingComponent } from './component/oder-processing/oder-processing.component';
import { StaffComponent } from './component/staff/staff.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './service/auth.guard';
import { RoleGuardService } from './service/role-guard.service';
import { DegiayComponent } from './component/degiay/degiay.component';
import { ChatlieuComponent } from './component/chatlieu/chatlieu.component';
import { MausacComponent } from './component/mausac/mausac.component';
import { KichcoComponent } from "./component/kichco/kichco.component";
import { ThuonghieuComponent } from "./component/thuonghieu/thuonghieu.component";
import { CreatDiscountComponent } from "./component/discount/creat-discount/creat-discount.component";
import { CreatVoucherComponent } from "./component/voucher/creat-voucher/creat-voucher.component";
import { DiscountComponent } from "./component/discount/discount.component";
import { DetailDiscountComponent } from "./component/discount/detail-discount/detail-discount.component";
import { DetailVoucherComponent } from "./component/voucher/detail-voucher/detail-voucher.component";
import { VoucherComponent } from "./component/voucher/voucher.component";
import { EditDiscountComponent } from "./component/discount/edit-discount/edit-discount.component";
import { EditVoucherComponent } from "./component/voucher/edit-voucher/edit-voucher.component";
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { OrderDetailComponent } from './component/order/order-detail/order-detail.component';
import { ThemSanPhamComponent } from './component/sanpham/them-san-pham/them-san-pham.component';
import { SuaSanPhamComponent } from './component/sanpham/sua-san-pham/sua-san-pham.component';
import { SalesCounterComponent } from './component/sales-counter/sales-counter.component';
import { ChitietsanphamComponent } from './component/chitietsanpham/chitietsanpham.component';
import { ThemChiTietSanPhamComponent } from './component/chitietsanpham/them-chi-tiet-san-pham/them-chi-tiet-san-pham.component';
import { SuaChiTietSanPhamComponent } from './component/chitietsanpham/sua-chi-tiet-san-pham/sua-chi-tiet-san-pham.component';
import { ThongKeComponent } from './component/thong-ke/thong-ke.component';
import { AddStaffComponent } from './component/staff/add-staff/add-staff.component';
import { OrderSalesCounterComponent } from './component/order-sales-counter/order-sales-counter.component';
import { UpdateStaffComponent } from './component/staff/update-staff/update-staff.component';
import { CreatVoucherShipComponent } from "./component/voucher-ship/creat-voucher-ship/creat-voucher-ship.component";
import { DetailVoucherShipComponent } from "./component/voucher-ship/detail-voucher-ship/detail-voucher-ship.component";
import { VoucherShipComponent } from "./component/voucher-ship/voucher-ship.component";
import { EditVoucherShipComponent } from './component/voucher-ship/edit-voucher-ship/edit-voucher-ship.component';
import { VnpayReturnComponent } from './component/sales-counter/vnpay-return/vnpay-return.component';

const routes: Routes = [
  { path: 'sales-counter/vnpay-payment', component: VnpayReturnComponent },

  { path: '', redirectTo: 'thong-ke', pathMatch: 'full' },

  { path: 'admin/login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },

  { path: 'don-hang', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'order-list', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'order-processing', component: OderProcessingComponent, canActivate: [AuthGuard] },
  { path: 'order-sales-counter', component: OrderSalesCounterComponent, canActivate: [AuthGuard] },
  { path: 'order-detail', component: OrderDetailComponent },

  // { path: 'admin/creat-discount', component: CreatDiscountComponent, canActivate: [AuthGuard] },
  // { path: 'admin/discount', component: DiscountComponent, canActivate: [AuthGuard] },
  // { path: 'admin/discount/:id', component: DetailDiscountComponent, canActivate: [AuthGuard] },
  // { path: 'admin/sua-giam-gia', component: EditDiscountComponent, canActivate: [AuthGuard] },
  // {
  //   path: 'admin/sua-giam-gia', component: EditDiscountComponent, canActivate: [RoleGuardService],
  //   data: {
  //     expectedRole: ['ADMIN']
  //   }
  // },
  // {
  //   path: 'admin/edit-discount/:id', component: EditDiscountComponent, canActivate: [RoleGuardService],
  //   data: {
  //     expectedRole: ['ADMIN']
  //   }
  // },

  { path: 'voucherFS', component: VoucherShipComponent, canActivate: [AuthGuard] },
  // { path: 'creat-voucherFS', component: CreatVoucherShipComponent, canActivate: [AuthGuard] },
  // { path: 'voucherFS/:id', component: DetailVoucherShipComponent, canActivate: [AuthGuard] },
  // {
  //   path: 'sua-voucherFS', component: EditVoucherShipComponent, canActivate: [RoleGuardService],
  //   data: {
  //     expectedRole: ['ADMIN']
  //   }
  // },
  // {
  //   path: 'edit-voucherFS/:id', component: EditVoucherShipComponent, canActivate: [RoleGuardService],
  //   data: {
  //     expectedRole: ['ADMIN']
  //   }
  // },


  // { path: 'creat-voucher', component: CreatVoucherComponent, canActivate: [AuthGuard] },
  // { path: 'voucher/:id', component: DetailVoucherComponent, canActivate: [AuthGuard] },
  { path: 'voucher', component: VoucherComponent, canActivate: [AuthGuard] },
  // { path: 'sua-voucher', component: EditVoucherComponent, canActivate: [AuthGuard] },
  // {
  //   path: 'sua-voucher', component: EditVoucherComponent, canActivate: [RoleGuardService],
  //   data: {
  //     expectedRole: ['ADMIN']
  //   }
  // },
  // {
  //   path: 'edit-voucher/:id', component: EditVoucherComponent, canActivate: [RoleGuardService],
  //   data: {
  //     expectedRole: ['ADMIN']
  //   }
  // },


  { path: 'degiay', component: DegiayComponent },
  // {
  //   path: 'degiay', component: DegiayComponent, canActivate: [RoleGuardService],
  //   data: {
  //     expectedRole: ['ADMIN']
  //   }
  // },

  {
    path: 'staff', component: StaffComponent, canActivate: [RoleGuardService],
    data: {
      expectedRole: ['ADMIN']
    }
  },
  // { path: 'add-staff', component: AddStaffComponent, canActivate: [AuthGuard] },
  // { path: 'update-staff/:id', component: UpdateStaffComponent, canActivate: [AuthGuard] },

  { path: 'chatlieu', component: ChatlieuComponent, canActivate: [AuthGuard] },

  { path: 'mausac', component: MausacComponent, canActivate: [AuthGuard] },

  { path: 'kichco', component: KichcoComponent, canActivate: [AuthGuard] },

  { path: 'thuonghieu', component: ThuonghieuComponent, canActivate: [AuthGuard] },

  { path: 'danh-muc', component: DanhmucComponent, canActivate: [AuthGuard] },

  { path: 'san-pham', component: SanphamComponent, canActivate: [AuthGuard] },
  // { path: 'them-san-pham', component: ThemSanPhamComponent, canActivate: [AuthGuard] },
  // { path: 'sua-san-pham/:idProduct', component: SuaSanPhamComponent, canActivate: [AuthGuard] },

  { path: 'chi-tiet-san-pham', component: ChitietsanphamComponent, canActivate: [AuthGuard] },
  // { path: 'them-chi-tiet-san-pham', component: ThemChiTietSanPhamComponent, canActivate: [AuthGuard] },
  // { path: 'sua-chi-tiet-san-pham/:idProduct', component: SuaChiTietSanPhamComponent, canActivate: [AuthGuard] },

  { path: 'sales-counter', component: SalesCounterComponent, canActivate: [AuthGuard] },

  { path: 'thong-ke', component: ThongKeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
