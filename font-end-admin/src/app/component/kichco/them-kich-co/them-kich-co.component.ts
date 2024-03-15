import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SizeService} from '../../../service/size.service';
import {CommonFunction} from '../../../util/common-function';
import {ValidateInput} from '../../model/validate-input';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-them-kich-co',
  templateUrl: './them-kich-co.component.html',
  styleUrls: ['./them-kich-co.component.css']
})
export class ThemKichCoComponent implements OnInit {
  validSizeNumber: ValidateInput = new ValidateInput();
  SizeNumber: string;
  Status: number = 0;
  rowData = [];
  constructor( public dialogRef: MatDialogRef<ThemKichCoComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private szsv: SizeService) { }

  ngOnInit(): void {
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateSizeNumber() {
    this.validSizeNumber = CommonFunction.validateInput(this.SizeNumber, 250, null);
  }
  clickadd(){
    this.SizeNumber = CommonFunction.trimText(this.SizeNumber);
    this.validateSizeNumber();
    if (!this.validSizeNumber.done) {
      return;
    }
    Swal.fire({
      title: 'Bạn có chắc thêm!',
      text: 'Thao tác này sẽ không hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Thêm'
    }).then((result1) => {
      if (result1.isConfirmed) {
        const size = {
          sizeNumber: this.SizeNumber,
          status: this.Status
        };
        this.szsv.AddSize(size).subscribe(
          result => {
            console.log('Size add success', result);
            this.dialogRef.close('addSize');
          },
          error => {
            console.error('Size add error', error);
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
