import { Component, Inject, OnInit } from '@angular/core';
import { StaffService } from '../../../service/staff.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-staff',
  templateUrl: './detail-staff.component.html',
  styleUrls: ['./detail-staff.component.css']
})
export class DetailStaffComponent implements OnInit {
  idStaff: string;

  staff = {
    fullname: '',
    phone: '',
    email: '',
    username: '',
    birthday: '',
    gender: '',
    description: '',
    role: '',
    idel: 0
  };

  constructor(
    private staffService: StaffService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.idStaff = this.data.idStaff;

    this.getStaffById(this.idStaff);


  }

  getStaffById(idStaff: string) {
    this.staffService.finById(idStaff).subscribe((response) => {
      this.staff = response.data;

      if (this.staff.birthday) {
        this.staff.birthday = this.formatDate(this.staff.birthday);
      }
    })
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
