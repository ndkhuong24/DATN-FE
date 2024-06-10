import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MausacService } from '../../../service/mausac.service';
import { CommonFunction } from '../../../util/common-function';
import { ValidateInput } from '../../model/validate-input';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sua-mau-sac',
  templateUrl: './sua-mau-sac.component.html',
  styleUrls: ['./sua-mau-sac.component.css'],
})
export class SuaMauSacComponent implements OnInit {
  validName: ValidateInput = new ValidateInput();
  validCode: ValidateInput = new ValidateInput();

  constructor(
    public dialogRef: MatDialogRef<SuaMauSacComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mssv: MausacService
  ) {}

  ngOnInit(): void {}

  revoveInvalid(result) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(
      this.data.name,
      250,
      '[^0-9]'
    );
  }
  validateCode() {
    this.validCode = CommonFunction.validateInput(this.data.code, 250, '');
  }

  clickUpdate(id: number) {
    this.data.name = CommonFunction.trimText(this.data.name);
    this.validateName();

    this.data.code = CommonFunction.trimText(this.data.code);
    this.validateCode();

    if (!this.validName.done || !this.validCode.done) {
      return;
    }
    Swal.fire({
      title: 'Bạn chắc muốn sửa',
      text: 'Bạn sẽ không thể hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sửa',
      cancelButtonText: 'Thoát',
    }).then((result1) => {
      if (result1.isConfirmed) {
        const color = {
          name: this.data.name,
          code: this.data.code,
          status: this.data.status,
        };
        this.mssv.UpdateMauSac(id, color).subscribe(
          (result) => {
            console.log('Color add success', result);
            this.dialogRef.close('saveColor');
          },
          (error) => {
            console.error('Color add error', error);
          }
        );
        Swal.fire('Sửa', 'Sửa thành công', 'success');
      }
    });
  }
}
