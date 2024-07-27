import { Component, Inject, OnInit } from '@angular/core';
import { UsersDTO } from '../../model/UsersDTO';
import { CommonFunction } from '../../../util/common-function';
import { ValidateInput } from '../../model/validate-input';
import { StaffService } from '../../../service/staff.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-staff',
  templateUrl: './update-staff.component.html',
  styleUrls: ['./update-staff.component.css']
})

export class UpdateStaffComponent implements OnInit {
  validFullName: ValidateInput = new ValidateInput();
  validPhone: ValidateInput = new ValidateInput();
  validEmail: ValidateInput = new ValidateInput();
  validUserName: ValidateInput = new ValidateInput();
  validPassword: ValidateInput = new ValidateInput();
  checkStartDateNull: boolean = false;
  validDescription: ValidateInput = new ValidateInput();

  Gender: string = 'Nam';
  Role: string = 'STAFF';
  Idel: number = 0;
  idStaff: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateStaffComponent>,
    private staffService: StaffService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  isStartDateValid() {
    this.checkStartDateNull = false;

    if (!this.data.birthday) {
      this.checkStartDateNull = true;
    }
  }

  removeCheckStartDate() {
    this.checkStartDateNull = false;
  }

  clickUpdate(idstaff: number) {
    this.password = CommonFunction.trimText(this.password);

    if (this.password === '' || this.password === null || this.password === undefined) {
      this.data.fullname = CommonFunction.trimText(this.data.fullname);
      this.data.phone = CommonFunction.trimText(this.data.phone);
      this.data.email = CommonFunction.trimText(this.data.email);
      this.data.username = CommonFunction.trimText(this.data.username);
      this.data.birthday = CommonFunction.trimText(this.data.birthday);
      this.data.gender = CommonFunction.trimText(this.data.gender);
      this.data.description = CommonFunction.trimText(this.data.description);
      this.data.role = CommonFunction.trimText(this.data.role);
      this.data.idel = CommonFunction.trimText(this.data.idel);

      this.validateFullName();
      this.validatePhone();
      this.validateEmail();
      this.validateUserName();
      this.isStartDateValid();
      this.validateDescription();

      if (!this.validFullName.done || !this.validPhone.done || !this.validEmail.done ||
        !this.validUserName.done || this.checkStartDateNull || !this.validDescription.done) {
        return;
      }

      Swal.fire({
        title: 'Bạn muốn cập nhật không',
        text: 'Thao tác này sẽ không hoàn tác',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#dd3333',
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Thoát'
      }).then((result) => {
        if (result.isConfirmed) {
          const staffCurrent = {
            fullname: this.data.fullname,
            username: this.data.username,
            email: this.data.email,
            phone: this.data.phone,
            birthday: this.data.birthday,
            gender: this.data.gender,
            description: this.data.description,
            role: this.data.role,
            idel: this.data.idel,
            password: '',
          };
          console.log(staffCurrent)

          this.staffService.updateStaff(idstaff, staffCurrent).subscribe(
            data => {
              if (data.message === 'Phone existed') {
                this.toastr.error('Số điện thoại đã tồn tại');
                return;
              }
              if (data.message === 'Email existed') {
                this.toastr.error('Email đã tồn tại');
                return;
              }
              console.log('Material add success', result);
              this.dialogRef.close('saveStaff');
              Swal.fire('Cập nhật', 'Cập nhật thành công', 'success');
            },
            error => {
              console.error(error);
              Swal.fire('Lỗi', 'Đã xảy lỗi trong quá trình cập nhật', 'error');
            }
          );
        }
      })
    } else {
      this.data.fullname = CommonFunction.trimText(this.data.fullname);
      this.data.phone = CommonFunction.trimText(this.data.phone);
      this.data.email = CommonFunction.trimText(this.data.email);
      this.data.username = CommonFunction.trimText(this.data.username);
      this.password = CommonFunction.trimText(this.password);
      this.data.birthday = CommonFunction.trimText(this.data.birthday);
      this.data.gender = CommonFunction.trimText(this.data.gender);
      this.data.description = CommonFunction.trimText(this.data.description);
      this.data.role = CommonFunction.trimText(this.data.role);
      this.data.idel = CommonFunction.trimText(this.data.idel);

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
        title: 'Bạn muốn cập nhật không',
        text: 'Thao tác này sẽ không hoàn tác',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#dd3333',
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Thoát'
      }).then((result) => {
        if (result.isConfirmed) {
          const staffCurrent = {
            fullname: this.data.fullname,
            username: this.data.username,
            email: this.data.email,
            phone: this.data.phone,
            birthday: this.data.birthday,
            gender: this.data.gender,
            description: this.data.description,
            role: this.data.role,
            idel: this.data.idel,
            password: this.password,
          };

          console.log(staffCurrent)

          this.staffService.updateStaff(idstaff, staffCurrent).subscribe(
            data => {
              if (data.message === 'Phone existed') {
                this.toastr.error('Số điện thoại đã tồn tại');
                return;
              }
              if (data.message === 'Email existed') {
                this.toastr.error('Email đã tồn tại');
                return;
              }
              this.dialogRef.close('saveStaff');
              Swal.fire('Cập nhật', 'Cập nhật thành công', 'success');
            },
            error => {
              Swal.fire('Lỗi', 'Đã xảy lỗi trong quá trình cập nhật', 'error');
            }
          );
        }
      })
    }
  }

  // updateInfor() {
  //   this.staff.fullname = CommonFunction.trimText(this.staff.fullname);
  //   this.staff.phone = CommonFunction.trimText(this.staff.phone);
  //   this.staff.username = CommonFunction.trimText(this.staff.username);
  //   this.validateReceiver();
  //   this.validateEmail();
  //   this.validateReceiverPhone();
  //   // this.validateReceiverPassword();

  //   if (!this.validReceiver.done || !this.validEmail.done || !this.validReceiverPhone.done) {
  //     return;
  //   }

  //   this.id = this.activeRoute.snapshot.paramMap.get('id');

  //   this.staffService.updateStaff(this.id, this.staff).subscribe(
  //     data => {
  //       if (data.message === 'Phone existed') {
  //         this.toastr.error('Số điện thoại đã tồn tại');
  //         return;
  //       }
  //       if (data.message === 'Email existed') {
  //         this.toastr.error('Email đã tồn tại');
  //         return;
  //       }
  //       console.log(data);
  //       console.log(this.staff);
  //       const toastrRef = this.toastr.success('Cập nhật thành công!', 'Success', { timeOut: 1000 });
  //       this.router.navigate(['/staff']);
  //     },
  //     error => {
  //       console.error(error);
  //       this.toastr.error('Đã xảy ra lỗi khi cập nhật thông tin!', 'Error');
  //     }
  //   );
  // }

  // onAddImageClick() {
  //   document.getElementById('profilePicture').click();
  // }

  // onImageChange(event: any) {
  //   const input = event.target;
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     this.selectedImage = reader.result as string;
  //   };

  //   reader.readAsDataURL(input.files[0]);
  // }

  password: string;

  revoveInvalid(result: { done: boolean; }) {
    result.done = true;
  }

  validateFullName() {
    this.validFullName = CommonFunction.validateInput(this.data.fullname, 250, null);
  }

  validatePhone() {
    this.validPhone = CommonFunction.validateInput(this.data.phone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.data.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  validateUserName() {
    this.validUserName = CommonFunction.validateInputUTF8Space(this.data.username, 50, /^[a-z][a-z\d]*$/, true, true)
  }

  validatePassword() {
    this.validPassword = CommonFunction.validateInput(this.password, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  }

  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.data.description, 250, null);
  }
}
