import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {getFormattedDateCurrent, MAX_FILE_SIZE_UPLOAD} from '../../../util/util';
import {ProductService} from '../../../service/product.service';
import * as FileSaver from 'file-saver';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent implements OnInit {

  typeImport = 0;
  isShowImport = false;
  nameFile: any;
  sizeFile: any;
  disableImport = true;
  fileImport: File;
  errorUpload = false;
  totalRecord: number;
  totalError: number;
  isImported = false;
  fileName;
  fileSize;
  formImport: FormGroup;
  resultImport;
  formDatas: FormData;
  constructor(private matRef: MatDialogRef<ImportFileComponent>, private fb: FormBuilder,
              private productService: ProductService, private changeDetectorRef: ChangeDetectorRef,
              private toaStr: ToastrService) {
  }

  ngOnInit(): void {
    this.resultImport = null;
    this.isShowImport = true;
    this.formImport = this.fb.group({
      fileImport: ''
    });
  }

  cancel() {
    this.matRef.close('cancel-import');
  }

  downloadSampleFile() {
    this.productService.exportExcelProductTemplate().subscribe((data: Blob) => {
      const currentDate = new Date();
      const formattedDate = getFormattedDateCurrent(currentDate);
      const fileName = `DS_SanPham_Mau_${formattedDate}.xlsx`;
      FileSaver.saveAs(data, fileName);
    });
    this.changeDetectorRef.detectChanges();
  }

  upload(file) {
    this.fileName = file[0].name;
    this.fileSize = file[0].size;

    if (file.length === 0) {
      this.toaStr.error('File import không để trống!');
      this.isShowImport = true;
      return;
    }
    if (!(file[0].name.includes('.xlsx') || file[0].name.includes('.xls'))) {
      this.toaStr.error('File import không đúng định dạng!');
      this.isShowImport = true;
      return;
    } else if (file[0].size > 5242880) {
      this.toaStr.error('File Import lớn hơn 5MB');
      this.isShowImport = true;
      return;
    }

    const formData = new FormData();

    formData.append('file', file[0]);
    this.formDatas = formData;
    this.isShowImport = false;
  }

  removeFile() {
    this.formImport.get('fileImport').reset();
    this.resultImport = null;
    this.fileName = null;
    this.fileSize = null;
  }
  exportDataErrors() {
    if (this.resultImport === undefined) {
      this.toaStr.error('TEACHER.IMPORT.NOT_FILE_ERROR');
      return;
    }
    if (this.resultImport.listErrors.length > 0) {
        this.productService.exportExcelProductErrors(this.resultImport.listErrors).subscribe(res => {
          const currentDate = new Date();
          const formattedDate = getFormattedDateCurrent(currentDate);
          const fileName = `DS_SanPham_Errors_${formattedDate}.xlsx`;
          FileSaver.saveAs(res, fileName);
        });
    } else {
      this.toaStr.warning('Không có data lỗi!');
    }
  }


  importFile() {
    this.productService.importExcelProduct(this.formDatas, this.typeImport).subscribe((res: any) => {
      if (res.data != null) {
        this.resultImport = res.data;
        if (this.resultImport.numberSuccess > 0) {
          this.toaStr.success('Thành công' + ' ' + this.resultImport.numberSuccess + '/' + this.resultImport.total + ' ' + 'bản ghi');
        } else if (this.resultImport.numberErrors === this.resultImport.total) {
          this.toaStr.error('Thất bại' + ' ' + this.resultImport.numberErrors + '/' + this.resultImport.total + ' ' + 'bản ghi');
          return;
        }
      } else {
        this.toaStr.error(res.message);
      }
    }, err => {
      this.toaStr.error('Import lỗi');
    });
  }

}
