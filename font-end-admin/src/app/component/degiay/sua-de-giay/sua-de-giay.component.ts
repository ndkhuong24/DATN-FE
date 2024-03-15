import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SoleService} from '../../../service/sole.service';
import {CommonFunction} from '../../../util/common-function';
import {ValidateInput} from '../../model/validate-input';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sua-de-giay',
  templateUrl: './sua-de-giay.component.html',
  styleUrls: ['./sua-de-giay.component.css']
})
export class SuaDeGiayComponent implements OnInit {
  validSoleHeight: ValidateInput = new ValidateInput();
  validSoleMaterial: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  constructor( public dialogRef: MatDialogRef<SuaDeGiayComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private slsv: SoleService) { }

  ngOnInit(): void {
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateSoleHeight() {
    this.validSoleHeight = CommonFunction.validateInput(this.data.soleHeight, 250, null);
  }
  validateSoleMaterial() {
    this.validSoleMaterial = CommonFunction.validateInput(this.data.soleMaterial, 250, null);
  }
  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.data.description, 250, null);
  }
  clickUpdate(id: number){
    this.data.soleHeight = CommonFunction.trimText(this.data.soleHeight);
    this.data.soleMaterial = CommonFunction.trimText(this.data.soleMaterial);
    this.data.description = CommonFunction.trimText(this.data.description);
    this.validateDescription();
    this.validateSoleHeight();
    this.validateSoleMaterial();
    if (!this.validSoleHeight.done || !this.validSoleMaterial.done || !this.validDescription.done) {
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
        const sole = {
          soleHeight: this.data.soleHeight,
          soleMaterial: this.data.soleMaterial,
          description: this.data.description,
          status: this.data.status
        };
        this.slsv.UpdateSole(id, sole).subscribe(
          result => {
            console.log('Sole add success', result);
            this.dialogRef.close('saveSole');
          },
          error => {
            console.error('Sole add error', error);
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
