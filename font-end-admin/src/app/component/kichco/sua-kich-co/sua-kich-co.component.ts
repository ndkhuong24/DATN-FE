import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SizeService} from '../../../service/size.service';
import {CommonFunction} from '../../../util/common-function';
import {ValidateInput} from '../../model/validate-input';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sua-kich-co',
  templateUrl: './sua-kich-co.component.html',
  styleUrls: ['./sua-kich-co.component.css']
})
export class SuaKichCoComponent implements OnInit {
  validSizeNumber: ValidateInput = new ValidateInput();
  rowData: [];
  constructor(public dialogRef: MatDialogRef<SuaKichCoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private szsv: SizeService) { }

  ngOnInit(): void {
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateSizeNumber() {
    this.validSizeNumber = CommonFunction.validateInput(this.data.sizeNumber, 250, null);
  }
  clickUpdate(id: number){
    this.data.sizeNumber = CommonFunction.trimText(this.data.sizeNumber);
    this.validateSizeNumber();
    if (!this.validSizeNumber.done) {
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
        const size = {
          sizeNumber: this.data.sizeNumber,
          status: this.data.status
        };
        this.szsv.UpdateSize(id, size).subscribe(
          result => {
            console.log('Size add success', result);
            this.dialogRef.close('saveSize');
          },
          error => {
            console.error('Size add error', error);
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
