import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ValidateInput } from '../../model/validate-input';
import { CommonFunction } from '../../../util/common-function';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {
  rowData = [];
  // defaultImagePath = 'C:/Users/ADMIN/Downloads/PH20528.jpg';
  // selectedImage: string = this.defaultImagePath;
  // form: any = {
  //   fullname: '',
  //   username: '',
  //   password: '',
  //   email: '',
  //   phone: '',
  //   birthday: '',
  //   gender: 'Nam',
  //   description: '',
  //   role: 'STAFF',
  //   idel: 0,
  // };
  // signUpForm: SignUpRepquest;
  FullName: string;
  validFullName: ValidateInput = new ValidateInput();

  Phone: string;
  validPhone: ValidateInput = new ValidateInput();

  Email: string;
  validEmail: ValidateInput = new ValidateInput();

  UserName: string;
  validUserName: ValidateInput = new ValidateInput();

  Password: string;
  validPassword: ValidateInput = new ValidateInput();

  Birthday: any;
  checkStartDateNull: boolean = false;

  Gender: string = 'Nam';

  Description: string;
  validDescription: ValidateInput = new ValidateInput();

  Role: string = 'STAFF';

  Idel: number = 0;

  constructor(
    private staffService: AuthService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddStaffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  addStaff() {
    this.validateFullName();
    this.validatePhone();
    this.validateEmail();
    this.validateUserName();
    this.validatePassword();
    this.isStartDateValid();
    this.validateDescription();

    if (!this.validFullName.done || !this.validPhone.done || !this.validEmail.done ||
      !this.validUserName.done || !this.validPassword.done || this.checkStartDateNull || !this.validDescription.done) {
      return;
    }

    Swal.fire({
      title: 'Bạn muốn thêm',
      text: 'Thao tác này sẽ không hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#dd3333',
      confirmButtonText: 'Thêm',
      cancelButtonText: 'Thoát'
    }).then((result) => {
      if (result.isConfirmed) {
        const staff = {
          fullname: this.FullName,
          username: this.UserName,
          password: this.Password,
          email: this.Email,
          phone: this.Phone,
          birthday: this.Birthday,
          gender: this.Gender,
          description: this.Description,
          role: this.Role,
          idel: this.Idel,
        };
        this.staffService.signUp(staff).subscribe(response => {
          if (response.message === 'The email is existed') {
            this.toastr.error('Email đã tồn tại', 'Lỗi');
            return;
          }
          if (response.message === 'The Username is existed') {
            this.toastr.error('Tên đăng nhập đã tồn tại', 'Lỗi');
            return;
          }
          if (response.message === 'The phone is existed') {
            this.toastr.error('Số điện thoại đã tồn tại', 'Lỗi');
            return;
          }
          if (response.message === 'Create Success') {
            this.dialogRef.close('addStaff');
            this.cdr.detectChanges();
            Swal.fire({ title: 'Thêm', text: 'Thêm thành công', icon: 'success' });
          }
        })
      }
    })
  }

  ngOnInit(): void {
    this.Birthday = '';
  }

  isStartDateValid() {
    this.checkStartDateNull = false;

    if (!this.Birthday) {
      this.checkStartDateNull = true;
    }
  }

  removeCheckStartDate() {
    this.checkStartDateNull = false;
  }

  revoveInvalid(result: ValidateInput) {
    result.done = true;
  }

  validateFullName() {
    this.validFullName = CommonFunction.validateInput(this.FullName, 250, null);
  }

  validatePhone() {
    this.validPhone = CommonFunction.validateInput(this.Phone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.Email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  validateUserName() {
    this.validUserName = CommonFunction.validateInputUTF8Space(this.UserName, 50, /^[a-z][a-z\d]*$/, true, true)
  }

  validatePassword() {
    this.validPassword = CommonFunction.validateInput(this.Password, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  }

  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.Description, 250, null);
  }
}
