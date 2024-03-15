import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SuaKichCoComponent} from '../sua-kich-co/sua-kich-co.component';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {MatDialog} from '@angular/material/dialog';
import {SizeService} from '../../../service/size.service';
import {KichcoComponent} from '../kichco.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-kich-co-action',
  templateUrl: './kich-co-action.component.html',
  styleUrls: ['./kich-co-action.component.css']
})
export class KichCoActionComponent implements ICellRendererAngularComp, OnInit {

  rowData = [];
  params: any;
  agInit(params: any): void {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  constructor(private matdialog: MatDialog,
              private szsv: SizeService,
              private cdr: ChangeDetectorRef,
              private kichcoComponent: KichcoComponent
  ) { }

  ngOnInit(): void {
    this.getAllSize();
  }
  openUpdate(){
    const dialogref = this.matdialog.open(SuaKichCoComponent, {
      width: '65vh',
      height: '50vh',
      data: this.params
    });
    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'saveSize') {
        this.kichcoComponent.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
  getAllSize(){
    this.szsv.getAllSize().subscribe(result => {
      this.rowData = result;
    });
  }
  deleteSize(size?: any) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa!',
      text: 'Bạn sẽ không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa!'
    }).then((result) => {
      if (result.isConfirmed) {
    size = this.params.id;
    console.log(size);
    this.szsv.DeleteSize(size).subscribe(() => {
      this.kichcoComponent.ngOnInit();
      this.cdr.detectChanges();
    });
    Swal.fire(
          'Xóa!',
          'Xóa thành công',
          'success'
        );
      }
    });
  }

}
