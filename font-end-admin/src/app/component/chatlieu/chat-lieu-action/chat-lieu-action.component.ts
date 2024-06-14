import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SuaChatLieuComponent } from '../sua-chat-lieu/sua-chat-lieu.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialpostService } from '../../../service/materialpost.service';
import { ChatlieuComponent } from '../chatlieu.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-lieu-action',
  templateUrl: './chat-lieu-action.component.html',
  styleUrls: ['./chat-lieu-action.component.css'],
})

export class ChatlieuActionComponent
  implements OnInit
{
  params: any;
  rowData = [];

  agInit(params: any) {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  constructor(
    private matdialog: MatDialog,
    private mtsv: MaterialpostService,
    private cdr: ChangeDetectorRef,
    private chatLieuComponent: ChatlieuComponent
  ) {}

  ngOnInit(): void {
    this.getAllMaterial();
  }

  getAllMaterial() {
    this.mtsv.getAllMaterial().subscribe((result) => {
      this.rowData = result;
    });
  }

  openUpdate() {
    const dialogref = this.matdialog.open(SuaChatLieuComponent, {
      width: '65vh',
      height: '47vh',
      data: this.params,
    });
    dialogref.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'saveMaterial') {
        this.chatLieuComponent.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  deleteMaterial(material?: any) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa',
      text: 'Bạn sẽ không thể hoàn tác',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Thoát',
    }).then((result) => {
      if (result.isConfirmed) {
        material = this.params.id;
        this.mtsv.DeleteMaterial(material).subscribe(() => {
          this.chatLieuComponent.ngOnInit();
          this.cdr.detectChanges();
        });
        Swal.fire('Xóa', 'Xóa thành công', 'success');
      }
    });
  }
}
