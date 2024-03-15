import {Component, Inject, OnInit} from '@angular/core';
import {UsersDTO} from '../../model/UsersDTO';
import {CommonFunction} from '../../../util/common-function';
import {ValidateInput} from '../../model/validate-input';
import {StaffService} from '../../../service/staff.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-update-staff',
  templateUrl: './update-staff.component.html',
  styleUrls: ['./update-staff.component.css']
})
export class UpdateStaffComponent implements OnInit {
  defaultImagePath = 'path/to/default-image.jpg';
  selectedImage: string = this.defaultImagePath;
  staff: UsersDTO;
  validReceiver: ValidateInput = new ValidateInput();
  validEmail: ValidateInput = new ValidateInput();
  validReceiverPhone: ValidateInput = new ValidateInput();
  validUsername: ValidateInput = new ValidateInput();
  validReceiverPassword: ValidateInput = new ValidateInput();
  validReceivernewPassword: ValidateInput = new ValidateInput();
  id: string;
  constructor(private staffService: StaffService, private toastr: ToastrService, private router: Router, private activeRoute: ActivatedRoute) { }
  findById(){
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.staffService.finById(this.id).subscribe(
      data => {
        this.staff = data.data;
        console.log(data.data);
      },
      error => {
        console.error('Error fetching staff by ID:', error);
      }
    );
  }
  ngOnInit(): void {
    this.findById();
  }
  updateInfor(){
    this.staff.fullname = CommonFunction.trimText(this.staff.fullname);
    this.staff.phone = CommonFunction.trimText(this.staff.phone);
    this.staff.username = CommonFunction.trimText(this.staff.username);
    this.validateReceiver();
    this.validateEmail();
    this.validateReceiverPhone();
    // this.validateReceiverPassword();
    if (!this.validReceiver.done || !this.validEmail.done || !this.validReceiverPhone.done ){
      return;
    }
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.staffService.updateStaff(this.id, this.staff).subscribe(
      data => {
        if (data.message === 'Phone existed'){
          this.toastr.error('Số điện thoại đã tồn tại');
          return;
        }
        if (data.message === 'Email existed'){
          this.toastr.error('Email đã tồn tại');
          return;
        }
        console.log(data);
        console.log(this.staff);
        const toastrRef = this.toastr.success('Cập nhật thành công!', 'Success', { timeOut: 1000});
        this.router.navigate(['/staff']);
      },
      error => {
        console.error(error);
        this.toastr.error('Đã xảy ra lỗi khi cập nhật thông tin!', 'Error');
      }
    );
  }
  onAddImageClick() {
    document.getElementById('profilePicture').click();
  }
  onImageChange(event: any) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };

    reader.readAsDataURL(input.files[0]);
  }

  revoveInvalid(result) {
    result.done = true;
  }
  validateReceiver() {
    this.validReceiver = CommonFunction.validateInput(this.staff.fullname, 250, null);
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.staff.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
  validateReceiverPhone() {
    this.validReceiverPhone = CommonFunction.validateInput(this.staff.phone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }
  validateReceiverPassword(){
    this.validReceiverPassword = CommonFunction.validateInput(this.staff.passwword, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  }
  validateReceiverUsername(){
    this.validUsername = CommonFunction.validateInputUTF8Space(this.staff.username, 50, /^[a-z][a-z\d]*$/, true, true );
  }
  // validateReceivernewPassword(){
  //   this.validReceivernewPassword = CommonFunction.validateInput(this.staff.newPass, 50, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  // }
}
