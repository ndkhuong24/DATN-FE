import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MausacService } from '../../../service/mausac.service';
import { ValidateInput } from '../../model/validate-input';
import { CommonFunction } from '../../../util/common-function';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-them-mau-sac',
  templateUrl: './them-mau-sac.component.html',
  styleUrls: ['./them-mau-sac.component.css'],
})
export class ThemMauSacComponent implements OnInit {
  Name: string;
  validName: ValidateInput = new ValidateInput();

  Code: string;
  validCode: ValidateInput = new ValidateInput();

  Status: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ThemMauSacComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mssv: MausacService
  ) {}

  ngOnInit(): void {}

  clickadd() {
    this.Name = CommonFunction.trimText(this.Name);
    this.Code = CommonFunction.trimText(this.Code);

    this.validateName();
    this.validateCode();

    if (!this.validName.done || !this.validCode.done) {
      return;
    }
    Swal.fire({
      title: 'Bạn muốn thêm',
      text: 'Thao tác này sẽ không hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thêm',
    }).then((result) => {
      if (result.isConfirmed) {
        const color = {
          name: this.Name,
          code: this.Code,
          status: this.Status,
        };
        this.mssv.AddMauSac(color).subscribe(
          (result1) => {
            Swal.fire({
              title: 'Thêm',
              text: 'Thêm thành công',
              icon: 'success',
            });
            console.log('Color add success', result1);
            this.dialogRef.close('addColor');
          },
          (error) => {
            console.error('Color add error', error);
          }
        );
      }
    });
  }

  revoveInvalid(result) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.Name, 250, '[^0-9]');
  }

  validateCode() {
    this.validCode = CommonFunction.validateInput(this.Code, 250, '');
  }
}
