import {Component, Inject, OnInit} from '@angular/core';
import {StaffService} from '../../../service/staff.service';
import {ActivatedRoute} from '@angular/router';
import {UsersDTO} from '../../model/UsersDTO';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-detail-staff',
  templateUrl: './detail-staff.component.html',
  styleUrls: ['./detail-staff.component.css']
})
export class DetailStaffComponent implements OnInit {
  id: string;
  staff: UsersDTO;
  constructor(private staffService: StaffService, private activeRoute: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
    this.staff = this.data.staffData;
    this.formatBirthday();
  }
  private formatBirthday(): void {
    if (this.staff && this.staff.birthday) {
      const dateObject = new Date(this.staff.birthday);
      const formattedDate = this.formatDate(dateObject);
      this.staff.birthday = formattedDate;
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
