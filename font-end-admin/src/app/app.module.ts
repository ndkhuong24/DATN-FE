import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import {DegiayComponent} from './component/degiay/degiay.component';
import {BrowserModule} from '@angular/platform-browser';
import {ChangeDetectorRef, NgModule} from '@angular/core';
import {ChatlieuComponent} from './component/chatlieu/chatlieu.component';
import {MausacComponent} from './component/mausac/mausac.component';
import {KichcoComponent} from './component/kichco/kichco.component';
import {ThuonghieuComponent} from './component/thuonghieu/thuonghieu.component';
import {ThemChatLieuComponent} from './component/chatlieu/them-chat-lieu/them-chat-lieu.component';

import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {DiscountComponent} from './component/discount/discount.component';
import {VoucherComponent} from './component/voucher/voucher.component';
import {AgGridModule} from 'ag-grid-angular';
import {HomeComponent} from './component/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CreatDiscountComponent} from './component/discount/creat-discount/creat-discount.component';
import {ActionDiscountComponent} from './component/discount/action-discount/action-discount.component';
import {CreatVoucherComponent} from './component/voucher/creat-voucher/creat-voucher.component';
import {ActionVoucherComponent} from './component/voucher/action-voucher/action-voucher.component';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {EditDiscountComponent} from './component/discount/edit-discount/edit-discount.component';
import {EditVoucherComponent} from './component/voucher/edit-voucher/edit-voucher.component';
import {OrderComponent} from './component/order/order.component';
import {OderProcessingComponent} from './component/oder-processing/oder-processing.component';
import {StaffComponent} from './component/staff/staff.component';
import {LoginComponent} from './component/login/login.component';
import {JwtHelperService, JWT_OPTIONS} from '@auth0/angular-jwt';
import {NgSelectModule} from '@ng-select/ng-select';
import { SalesCounterComponent } from './component/sales-counter/sales-counter.component';
import {MatListModule} from '@angular/material/list';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import { CustomerComponent } from './component/customer/customer.component';
import { ImportFileComponent } from './component/sanpham/import-file/import-file.component';
import {DeGiayActionComponent} from './component/degiay/de-giay-action/de-giay-action.component';
import {KichCoActionComponent} from './component/kichco/kich-co-action/kich-co-action.component';
import {MauSacActionComponent} from './component/mausac/mau-sac-action/mau-sac-action.component';
import {SanPhamActionComponent} from './component/sanpham/san-pham-action/san-pham-action.component';
import {ThuongHieuActionComponent} from './component/thuonghieu/thuong-hieu-action/thuong-hieu-action.component';
import {DanhmucComponent} from './component/danhmuc/danhmuc.component';
import {SanphamComponent} from './component/sanpham/sanpham.component';
import {SuaChatLieuComponent} from './component/chatlieu/sua-chat-lieu/sua-chat-lieu.component';
import {ThemDanhMucComponent} from './component/danhmuc/them-danh-muc/them-danh-muc.component';
import {SuaDanhMucComponent} from './component/danhmuc/sua-danh-muc/sua-danh-muc.component';
import {ThemDeGiayComponent} from './component/degiay/them-de-giay/them-de-giay.component';
import {SuaDeGiayComponent} from './component/degiay/sua-de-giay/sua-de-giay.component';
import {ThemKichCoComponent} from './component/kichco/them-kich-co/them-kich-co.component';
import {SuaKichCoComponent} from './component/kichco/sua-kich-co/sua-kich-co.component';
import {ThemMauSacComponent} from './component/mausac/them-mau-sac/them-mau-sac.component';
import {SuaMauSacComponent} from './component/mausac/sua-mau-sac/sua-mau-sac.component';
import {ThemThuongHieuComponent} from './component/thuonghieu/them-thuong-hieu/them-thuong-hieu.component';
import {SuaThuongHieuComponent} from './component/thuonghieu/sua-thuong-hieu/sua-thuong-hieu.component';
import {ThemSanPhamComponent} from './component/sanpham/them-san-pham/them-san-pham.component';
import {SuaSanPhamComponent} from './component/sanpham/sua-san-pham/sua-san-pham.component';
import {ActionRendererComponent} from './component/chatlieu/action-renderer/action-renderer.component';
import {ActionCategoryRedererComponent} from './component/danhmuc/action-category-rederer/action-category-rederer.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {DetailDiscountComponent} from './component/discount/detail-discount/detail-discount.component';
import {DetailVoucherComponent} from './component/voucher/detail-voucher/detail-voucher.component';
import {SignUpComponent} from './component/sign-up/sign-up.component';
import {ActionOrderComponent} from './component/order/action-order/action-order.component';
import {OrderDetailComponent} from './component/order/order-detail/order-detail.component';
import { ChitietsanphamComponent } from './component/chitietsanpham/chitietsanpham.component';
import { ThemChiTietSanPhamComponent } from './component/chitietsanpham/them-chi-tiet-san-pham/them-chi-tiet-san-pham.component';
import { SuaChiTietSanPhamComponent } from './component/chitietsanpham/sua-chi-tiet-san-pham/sua-chi-tiet-san-pham.component';
import { ChiTietSanPhamActionComponent } from './component/chitietsanpham/chi-tiet-san-pham-action/chi-tiet-san-pham-action.component';
import {ThongKeComponent} from './component/thong-ke/thong-ke.component';
import { VoucherShipComponent } from './component/voucher-ship/voucher-ship.component';
import { ActionVoucherShipComponent } from './component/voucher-ship/action-voucher-ship/action-voucher-ship.component';
import { CreatVoucherShipComponent } from './component/voucher-ship/creat-voucher-ship/creat-voucher-ship.component';
import { EditVoucherShipComponent } from './component/voucher-ship/edit-voucher-ship/edit-voucher-ship.component';
import { DetailVoucherShipComponent } from './component/voucher-ship/detail-voucher-ship/detail-voucher-ship.component';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ChartsModule} from '@progress/kendo-angular-charts';
import 'hammerjs';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NoteOrderComponent } from './component/order/note-order/note-order.component';
import { AddStaffComponent } from './component/staff/add-staff/add-staff.component';
import { OrderSalesCounterComponent } from './component/order-sales-counter/order-sales-counter.component';
import { UpdateStaffComponent } from './component/staff/update-staff/update-staff.component';
import { DetailStaffComponent } from './component/staff/detail-staff/detail-staff.component';
import { OrderSalesDetailComponent } from './component/order-sales-counter/order-sales-detail/order-sales-detail.component';
import {DatePipe} from '@angular/common';

import { ActionStaffComponent } from './component/staff/action-staff/action-staff.component';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PogupVoucherSCComponent } from './component/sales-counter/pogup-voucher-sc/pogup-voucher-sc.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DegiayComponent,
    ChatlieuComponent,
    MausacComponent,
    KichcoComponent,
    ThuonghieuComponent,
    ThemChatLieuComponent,
    DiscountComponent,
    VoucherComponent,
    HomeComponent,
    CreatDiscountComponent,
    ActionDiscountComponent,
    CreatVoucherComponent,
    ActionVoucherComponent,
    EditDiscountComponent,
    EditVoucherComponent,
    OrderComponent,
    OderProcessingComponent,
    StaffComponent,
    LoginComponent,
    DanhmucComponent,
    SanphamComponent,
    SuaChatLieuComponent,
    ThemDanhMucComponent,
    SuaDanhMucComponent,
    ThemDeGiayComponent,
    SuaDeGiayComponent,
    ThemKichCoComponent,
    SuaKichCoComponent,
    ThemMauSacComponent,
    SuaMauSacComponent,
    ThemThuongHieuComponent,
    SuaThuongHieuComponent,
    ThemSanPhamComponent,
    SuaSanPhamComponent,
    ActionRendererComponent,
    ActionCategoryRedererComponent,
    DeGiayActionComponent,
    KichCoActionComponent,
    MauSacActionComponent,
    SanPhamActionComponent,
    ThuongHieuActionComponent,
    DetailDiscountComponent,
    DetailVoucherComponent,
    SignUpComponent,
    ActionOrderComponent,
    OrderDetailComponent,
    SalesCounterComponent,
    CustomerComponent,
    ImportFileComponent,
    ThongKeComponent,
    NoteOrderComponent,
    AddStaffComponent,
    OrderSalesCounterComponent,
    UpdateStaffComponent,
    DetailStaffComponent,
    OrderSalesDetailComponent,
    ChitietsanphamComponent,
    ThemChiTietSanPhamComponent,
    SuaChiTietSanPhamComponent,
    ChiTietSanPhamActionComponent,
    ActionStaffComponent,
    CreatVoucherShipComponent,
    EditVoucherShipComponent,
    ActionVoucherShipComponent,
    DetailVoucherShipComponent,
    VoucherShipComponent,
    PogupVoucherSCComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    FormsModule,
    HttpClientModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    NgSelectModule,
    MatTabsModule,
    ToastrModule.forRoot(),
    MatListModule,
    MatTableModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DateRangePickerModule,
    MatInputModule,
    DateRangePickerModule,
    ZXingScannerModule,
    MatSlideToggleModule
  ],
  bootstrap: [AppComponent],
  providers: [{provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService, ToastrService, DatePipe],
  entryComponents: [ActionRendererComponent],
})
export class AppModule {
}
