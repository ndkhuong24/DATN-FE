import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BrandService} from "../../../service/brand.service";
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sua-thuong-hieu',
  templateUrl: './sua-thuong-hieu.component.html',
  styleUrls: ['./sua-thuong-hieu.component.css']
})
export class SuaThuongHieuComponent implements OnInit {
  validName: ValidateInput = new ValidateInput();
  constructor(public dialogRef: MatDialogRef<SuaThuongHieuComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private brsv: BrandService) { }

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
    if ( !this.validName.done) {
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
    const brand = {
      name: this.data.name,
      status: this.data.status
    };
    this.brsv.UpdateBrand(id, brand).subscribe(
      result => {
        console.log('Brand add success', result);
        this.dialogRef.close('saveBrand');
      },
      error => {
        console.error('Brand add error', error);
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
