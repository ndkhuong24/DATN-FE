import { Component, OnInit } from '@angular/core';
import { UsersDTO } from '../model/UsersDTO';
import { CustomerInforService } from '../../service/customer-infor.service';
import { Router } from '@angular/router';
import { ValidateInput } from '../../model/validate-input.model';
import { CommonFunction } from '../../util/common-function';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  infoCustomer: UsersDTO = new UsersDTO();
  isOTPSent: boolean = false;
  validEmail: ValidateInput = new ValidateInput();

  constructor(
    private customerIFService: CustomerInforService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  sendMailOTP() {
    // Validate email trước khi gửi OTP
    this.validateEmail();

    if (!this.validEmail.done) {
      return; // Nếu email không hợp lệ, không tiếp tục
    }

    // Lưu email vào localStorage
    localStorage.setItem('emailForgot', this.infoCustomer.email);

    // Tạo đối tượng email để gửi
    const email: UsersDTO = {
      email: this.infoCustomer.email
    };

    // Gọi phương thức gửi OTP
    this.customerIFService.sendMailOTP(email).subscribe({
      next: (data) => {
        // Kiểm tra trạng thái phản hồi và cập nhật biến isOTPSent
        if (data.message === 'send mail successfully') { // Kiểm tra theo thông điệp trả về
          this.isOTPSent = true;
        } else {
          // Hiển thị thông báo lỗi nếu có
          this.toastr.error('Đã xảy ra lỗi. Vui lòng thử lại sau!', 'Error');
        }
      },
      error: (err) => {
        // Xử lý lỗi khi gửi yêu cầu
        console.error('Lỗi khi gửi OTP:', err);
        this.toastr.error('Đã xảy ra lỗi. Vui lòng thử lại sau!', 'Error');
      }
    });
  }

  verifyOTP() {
    const otp: UsersDTO = {
      email: this.infoCustomer.email,
      otp: this.infoCustomer.otp
    };

    this.customerIFService.verifyOTP(otp).subscribe({
      next: (data) => {
        if (data.status === '200') {
          this.router.navigate(['/reset-pass']);
        } else {
          this.toastr.error(data.message || 'Mã OTP đã hết hạn hoặc không chính xác, vui lòng thực hiện lại.', 'Error');
        }
      },
      error: (err) => {
        console.error('Lỗi khi xác thực OTP:', err);
        this.toastr.error('Mã OTP đã hết hạn hoặc không chính xác, vui lòng thực hiện lại.', 'Error');
      }
    });
  }

  // verifyOTP() {
  //   const otp: UsersDTO = {
  //     email: this.infoCustomer.email,
  //     otp: this.infoCustomer.otp
  //   };
  //   this.customerIFService.verifyOTP(otp).subscribe(data => {
  //     if (data.status === '200') {
  //       this.router.navigate(['/reset-pass']);
  //     } else {
  //       this.toastr.error('Mã OTP đã hết hạn hoặc không chính xác, Vui lòng thực hiện lại', 'Error');
  //     }
  //   },
  //   );
  // }

  ngOnInit(): void {
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.infoCustomer.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  revoveInvalid(result: { done: boolean; }) {
    result.done = true;
  }
}
