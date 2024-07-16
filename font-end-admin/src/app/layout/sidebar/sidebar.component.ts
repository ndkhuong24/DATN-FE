import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  role: 'ADMIN' | 'USER' | 'STAFF';

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    var userjson = localStorage.getItem("users");
    var users = JSON.parse(userjson);
    this.role = users.role;
  }

  logOut(): void {
    const itemsToRemove = ['token', 'users', 'fullname', 'id', 'listOrder'];

    itemsToRemove.forEach((item) => localStorage.removeItem(item));

    this.router.navigate(['/login']);
  }

  phanQuyenStaff(): void {
    if (this.role === 'ADMIN') {
      this.router.navigate(['/staff']);
    } else {
      this.toastr.error('Bạn không có quyền truy cập', 'Lỗi');
    }
  }

  phanQuyenVoucherFreeShip(): void {
    if (this.role === 'ADMIN') {
      this.router.navigate(['/voucherFS']);
    } else {
      this.toastr.error('Bạn không có quyền truy cập', 'Lỗi');
    }
  }

  phanQuyenVoucher(): void {
    if (this.role === 'ADMIN') {
      this.router.navigate(['/voucher']);
    } else {
      this.toastr.error('Bạn không có quyền truy cập', 'Lỗi');
    }
  }
}
