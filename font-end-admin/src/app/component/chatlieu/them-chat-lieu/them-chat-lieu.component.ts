import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MaterialpostService} from '../../../service/materialpost.service';
import * as _ from 'lodash';
import {ValidateInput} from '../../model/validate-input';
import {CommonFunction} from '../../../util/common-function';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-them-chat-lieu',
  templateUrl: './them-chat-lieu.component.html',
  styleUrls: ['./them-chat-lieu.component.css']
})
export class ThemChatLieuComponent implements OnInit {
  Name: string;
  Description: string;
  Status: number = 0;
  validName: ValidateInput = new ValidateInput();
  validDescription: ValidateInput = new ValidateInput();
  rowData = [];

  constructor(
    public dialogRef: MatDialogRef<ThemChatLieuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mtsv: MaterialpostService) {
  }

  getMaterial() {
    this.mtsv.getAllMaterial().subscribe(result => {
      this.rowData = result;
    });
  }

  clickadd() {
    this.Name = CommonFunction.trimText(this.Name);
    this.Description = CommonFunction.trimText(this.Description);
    this.validateName();
    this.validateDescription();
    if (!this.validName.done || !this.validDescription.done) {
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
    const material = {
        name: this.Name,
        description: this.Description,
        status: this.Status
      };
    this.mtsv.CreateMaterial(material).subscribe(
        result => {
          console.log('Material add success', result);
          this.dialogRef.close('addMaterial');
        },
        error => {
          console.error('Material add error', error);
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

  ngOnInit(): void {
    this.getMaterial();
  }
  revoveInvalid(result) {
    result.done = true;
  }

  validateName() {
    this.validName = CommonFunction.validateInput(this.Name, 250, null);
  }
  validateDescription() {
    this.validDescription = CommonFunction.validateInput(this.Description, 250, null);
  }
}
