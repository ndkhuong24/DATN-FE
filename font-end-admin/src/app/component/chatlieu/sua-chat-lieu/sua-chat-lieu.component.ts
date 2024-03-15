import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MaterialpostService} from '../../../service/materialpost.service';
import * as _ from 'lodash';
import {CommonFunction} from '../../../util/common-function';
import {ValidateInput} from '../../model/validate-input';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sua-chat-lieu',
  templateUrl: './sua-chat-lieu.component.html',
  styleUrls: ['./sua-chat-lieu.component.css']
})
export class SuaChatLieuComponent implements OnInit{
  rowData = [];
  validName: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  constructor(
    public dialogRef: MatDialogRef<SuaChatLieuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mtsv: MaterialpostService) { }
  clickUpdate(id: number){
    this.data.name = CommonFunction.trimText(this.data.name);
    this.data.description = CommonFunction.trimText(this.data.description);
    this.validateName();
    this.validateDescription();
    if (this.validName.done === false || !this.validDescription.done) {
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
    const material = {
      name: this.data.name,
      description: this.data.description,
      status: this.data.status
    };
    this.mtsv.UpdateMaterial(id, material).subscribe(
      result => {
        console.log('Material add success', result);
        this.dialogRef.close('saveMaterial');
      },
      error => {
        console.error('Material add error', error);
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
  ngOnInit(): void {
  }
  revoveInvalid(result) {
    result.done = true;
  }
  validateName() {
    this.validName = CommonFunction.validateInput(this.data.name, 250, null);
  }
  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.data.description, 250, null);
  }
}
