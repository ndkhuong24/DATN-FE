import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './component/home/home.component';
import {GiohangComponent} from './component/giohang/giohang.component';
import {DetailsComponent} from './component/details/details.component';
import {SanphamComponent} from './component/sanpham/sanpham.component';
import {CookieService} from 'ngx-cookie-service';
import {CheckoutComponent} from './component/checkout/checkout.component';

import {LoginComponent} from './component/login/login.component';
import {SignUpComponent} from './component/sign-up/sign-up.component';
import {AuthService} from './service/authentication/auth.service';
import {DetailCheckoutComponent} from './component/checkout/detail-checkout/detail-checkout.component';
import {OrderComponent} from './component/order/order.component';
import {ForgotPasswordComponent} from './component/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './component/reset-password/reset-password.component';
import {InfoUserComponent} from './component/info-user/info-user.component';
import {OrderNotLoginComponent} from './component/order-not-login/order-not-login.component';
import {SearchOrderComponent} from './component/search-order/search-order.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'shopping-cart', component: GiohangComponent},
  { path: 'product-details/:idProduct', component: DetailsComponent},
  { path: 'sanpham', component: SanphamComponent},
  { path: 'login', component: LoginComponent},
  { path: 'sign-up', component: SignUpComponent},
  { path: 'cart/checkout', component: CheckoutComponent},
  { path: 'cart/checkout-detail', component: DetailCheckoutComponent},
  {path: 'order', component: OrderComponent, canActivate: [AuthService]},
  // {path: 'order/not-login/:codeOrder', component: OrderNotLoginComponent},
  { path: 'forgot-pass', component: ForgotPasswordComponent},
  { path: 'reset-pass', component: ResetPasswordComponent},
  { path: 'user-profile', component: InfoUserComponent, canActivate: [AuthService]},
  { path: 'tra-cuu-don-hang', component: SearchOrderComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [CookieService],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
