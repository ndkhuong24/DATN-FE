import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SoleService} from '../../../service/sole.service';
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-them-de-giay',
  templateUrl: './them-de-giay.component.html',
  styleUrls: ['./them-de-giay.component.css']
})
export class ThemDeGiayComponent implements OnInit {
  SoleHeight: string;
  SoleMaterial: string;
  Description: string;
  Status: number = 0;
  validSoleHeight: ValidateInput = new ValidateInput();
  validSoleMaterial: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();

  constructor(public dialogRef: MatDialogRef<ThemDeGiayComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private slsv: SoleService) { }

  ngOnInit(): void {
  }
  clickadd(){
    this.SoleHeight = CommonFunction.trimText(this.SoleHeight);
    this.SoleMaterial = CommonFunction.trimText(this.SoleMaterial);
    this.Description = CommonFunction.trimText(this.Description);
    this.validateDescription();
    this.validateSoleHeight();
    this.validateSoleMaterial();
    if (!this.validSoleHeight.done || !this.validSoleMaterial.done || !this.validDescription.done) {
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
        const sole = {
          soleHeight: this.SoleHeight,
          soleMaterial: this.SoleMaterial,
          description: this.Description,
          status: this.Status
        };
        this.slsv.AddSole(sole).subscribe(
          result => {
            console.log('Sole add success', result);
            this.dialogRef.close('addSole');
          },
          error => {
            console.error('Sole add error', error);
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

  validateSoleHeight() {
    this.validSoleHeight = CommonFunction.validateInput(this.SoleHeight, 250, null);
  }
  validateSoleMaterial() {
    this.validSoleMaterial = CommonFunction.validateInput(this.SoleMaterial, 250, null);
  }
  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.Description, 250, null);
  }

}
