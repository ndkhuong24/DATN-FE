import {Component, Inject, OnInit} from '@angular/core';
import { CategoryService} from '../../../service/category.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as _ from 'lodash';
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-them-danh-muc',
  templateUrl: './them-danh-muc.component.html',
  styleUrls: ['./them-danh-muc.component.css']
})
export class ThemDanhMucComponent implements OnInit {
  validName: ValidateInput = new ValidateInput();
  Name: string;
  Status: number = 0;
  constructor(public dialogRef: MatDialogRef<ThemDanhMucComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ctsv: CategoryService) {
  }

  ngOnInit(): void {
  }
  clickadd(){
    this.Name = CommonFunction.trimText(this.Name);
    this.validateName();
    if (!this.validName.done) {
      return;
    }
    Swal.fire({
      title: 'Bạn muốn thêm?',
      text: 'Thao tác này sẽ không hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thêm'
    }).then((result1) => {
      if (result1.isConfirmed) {
    const category = {
        name: this.Name,
        status: this.Status
      };
    this.ctsv.AddCategory(category).subscribe(
        result => {
          console.log('Category add success', result);
          this.dialogRef.close('addCategory');
        },
        error => {
          console.error('Category add error', error);
        }
      );
    Swal.fire(
          'Thêm',
          'Thêm thành công',
          'success'
        );
      }
    });
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.Name, 250, null);
  }

}
