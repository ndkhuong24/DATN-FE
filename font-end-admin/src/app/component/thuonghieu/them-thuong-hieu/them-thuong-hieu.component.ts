import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BrandService} from "../../../service/brand.service";
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-them-thuong-hieu',
  templateUrl: './them-thuong-hieu.component.html',
  styleUrls: ['./them-thuong-hieu.component.css']
})
export class ThemThuongHieuComponent implements OnInit {
  validName: ValidateInput = new ValidateInput();
  Name: string;
  status: number = 0;
  constructor(public dialogRef: MatDialogRef<ThemThuongHieuComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private brsv: BrandService) { }

  ngOnInit(): void {
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.Name, 250, null);
  }
  clickadd(){
    this.Name = CommonFunction.trimText(this.Name);
    this.validateName();
    if ( !this.validName.done ) {
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
    const brand = {
      name: this.Name,
      status: this.status
    };
    this.brsv.AddBrand(brand).subscribe(
      result => {
        console.log('Brand add success', result);
        this.dialogRef.close('addBrand');
      },
      error => {
        console.error('Brand add error', error);
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

}
