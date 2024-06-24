import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StaffService } from '../../../service/staff.service';
import { DetailStaffComponent } from '../detail-staff/detail-staff.component';
import { StaffComponent } from '../staff.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action-staff',
  templateUrl: './action-staff.component.html',
  styleUrls: ['./action-staff.component.css']
})
export class ActionStaffComponent implements OnInit {
  params: any;
  rowData1 = [];
  rowData2 = [];

  constructor(
    private matdialog: MatDialog,
    private staffService: StaffService,
    private staffComponent: StaffComponent,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getAllStaff();
  }

  getAllStaff() {
    this.staffService.getAllStaff().subscribe((response) => {
      this.rowData1 = response.filter((staff: { idel: number; }) => staff.idel === 0);
      this.rowData2 = response.filter((staff: { idel: number; }) => staff.idel === 1);
    })
  }

  agInit(params: any) {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  clickDetail(id: number): void {
    const dialogref = this.matdialog.open(DetailStaffComponent, {
      width: '80vh',
      height: '80vh',
      data: { idStaff: id },
    });
    dialogref.afterClosed().subscribe(() => {
      this.staffComponent.ngOnInit();
      this.cdr.detectChanges();
    });
  }
}
