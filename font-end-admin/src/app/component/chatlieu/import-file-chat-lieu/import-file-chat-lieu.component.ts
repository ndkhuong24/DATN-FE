import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaterialpostService } from 'src/app/service/materialpost.service';

@Component({
  selector: 'app-import-file-chat-lieu',
  templateUrl: './import-file-chat-lieu.component.html',
  styleUrls: ['./import-file-chat-lieu.component.scss']
})
export class ImportFileMaterialComponent implements OnInit {
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

  constructor(
    private matRef: MatDialogRef<ImportFileMaterialComponent>,
    private fb: FormBuilder,
    private materialService: MaterialpostService,
    private toaStr: ToastrService
  ) {
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
    this.materialService.exportDataTemplate().subscribe(response => {
      // Create a new Blob object using the response data
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);

      // Set link attributes
      link.href = url;
      link.download = `DS_ChatLieu_Template.xlsx`;

      // Append link to the body
      document.body.appendChild(link);

      // Trigger click event to download the file
      link.click();

      // Remove link from the body
      document.body.removeChild(link);
    });
  }

  upload(file: string | any[]) {
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

  importFile(): void {
    if (!this.formDatas) {
      this.toaStr.error('Chưa chọn file để import!', 'Thông báo');
      return;
    }

    this.materialService.onUpload(this.formDatas).subscribe(
      (response: string) => {
        if (response === "File imported successfully") {
          this.resultImport = response;
          this.toaStr.success('Nhập dữ liệu thành công!');
          this.fileName = null;
          this.fileSize = null;
          this.formDatas = null;
          this.isShowImport = true;
          this.matRef.close('cancel-import');
        }
      },
      (error: any) => {
        this.toaStr.error('Lỗi khi nhập dữ liệu!', 'Thông báo');
        console.error('Error importing file', error);
      }
    );
  }
}
