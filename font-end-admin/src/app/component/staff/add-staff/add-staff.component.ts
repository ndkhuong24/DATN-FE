import { Component, OnInit } from '@angular/core';
import {SignUpRepquest} from '../../model/SignUpRepquest';
import {StaffService} from '../../../service/staff.service';
import {UsersDTO} from '../../model/UsersDTO';
import {Router} from '@angular/router';
import {AuthService} from '../../../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';


@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {
  defaultImagePath = 'C:/Users/ADMIN/Downloads/PH20528.jpg';
  selectedImage: string = this.defaultImagePath;
  form: any = {
    fullname: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    birthday: '',
    gender: 'Nam',
    description: '',
    role: 'STAFF',
    idel: 0,
  };
  signUpForm: SignUpRepquest;
  validReceiver: ValidateInput = new ValidateInput();
  validEmail: ValidateInput = new ValidateInput();
  validReceiverPhone: ValidateInput = new ValidateInput();
  validUsername: ValidateInput = new ValidateInput();
  validReceiverPassword: ValidateInput = new ValidateInput();
  constructor(private staffService: AuthService, private router: Router, private toastr: ToastrService) { }
  addStaff() {
    this.form.fullname = CommonFunction.trimText(this.form.fullname);
    this.form.phone = CommonFunction.trimText(this.form.phone);
    this.form.username = CommonFunction.trimText(this.form.username);
    this.validateReceiver();
    this.validateEmail();
    this.validateReceiverPhone();
    this.validateReceiverUsername();
    this.validateReceiverPassword();
    if (!this.validReceiver.done || !this.validEmail.done || !this.validReceiverPhone.done
      || !this.validUsername.done || !this.validReceiverPassword.done
    ) {
      return;
    }
    this.signUpForm = new SignUpRepquest (
      this.form.fullname,
      this.form.username,
      this.form.password,
      this.form.email,
      this.form.phone,
      this.form.birthday,
      this.form.gender,
      this.form.description,
      this.form.role,
      this.form.idel
    );
    console.log(this.signUpForm);
    this.staffService.signUp(this.signUpForm).subscribe(data =>{
      console.log(data);
      if (data.message === 'The email is existed'){
        this.toastr.error('Email đã tồn tại', 'Lỗi');
        return;
      }
      if (data.message === 'The Username is existed'){
        this.toastr.error('Tên đăng nhập đã tồn tại', 'Lỗi');
        return;
      }
      if (data.message === 'The phone is existed'){
        this.toastr.error('Số điện thoại đã tồn tại', 'Lỗi');
        return;
      }
      if (data.message === 'Create Success'){
        alert('Đăng kí thành công ! ');
        this.router.navigate(['/staff']);
      }
    });
  }
  onAddImageClick() {
    document.getElementById('profilePicture').click();
    console.log(this.selectedImage);
  }

  onResetImageClick() {
    document.getElementById('profilePicture')['value'] = '';
    // Đặt ảnh mặc định
    this.selectedImage = this.defaultImagePath;
  }

  onImageChange(event: any) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };

    reader.readAsDataURL(input.files[0]);
  }


  ngOnInit(): void {
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateReceiver() {
    this.validReceiver = CommonFunction.validateInput(this.form.fullname, 250, null);
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.form.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
  validateReceiverPhone() {
    this.validReceiverPhone = CommonFunction.validateInput(this.form.phone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }
  validateReceiverUsername(){
    this.validUsername = CommonFunction.validateInputUTF8Space(this.form.username, 50, /^[a-z][a-z\d]*$/, true, true );
  }
  validateReceiverPassword(){
    this.validReceiverPassword = CommonFunction.validateInput(this.form.password, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  }
}
