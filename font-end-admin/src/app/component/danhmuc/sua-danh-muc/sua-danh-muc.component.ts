import {Component, Inject, OnInit} from '@angular/core';
import {CategoryService} from '../../../service/category.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as _ from 'lodash';
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sua-danh-muc',
  templateUrl: './sua-danh-muc.component.html',
  styleUrls: ['./sua-danh-muc.component.css']
})
export class SuaDanhMucComponent implements OnInit {
  validName: ValidateInput = new ValidateInput();
  constructor(public dialogRef: MatDialogRef<SuaDanhMucComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ctsv: CategoryService
  ) { }

  ngOnInit(): void {
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.data.name, 250, null);
  }
  clickUpdate(id: number){
    this.data.name = CommonFunction.trimText(this.data.name);
    this.validateName();
    if (!this.validName.done) {
      return;
    }
    Swal.fire({
      title: 'Bạn chắc muốn sửa?',
      text: 'Bạn sẽ không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sửa!'
    }).then((result1) => {
      if (result1.isConfirmed) {
    const category = {
        name: this.data.name,
        status: this.data.status
      };
    this.ctsv.UpdateCategory(id, category).subscribe(
        result => {
          console.log('Category add success', result);
          this.dialogRef.close('saveCategory');
        },
        error => {
          console.error('Category add error', error);
        }
      );
    Swal.fire(
          'Sửa!',
          'Sửa thành công',
          'success'
        );
      }
    });
  }
}
