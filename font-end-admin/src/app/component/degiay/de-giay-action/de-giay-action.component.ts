import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SuaDeGiayComponent} from '../sua-de-giay/sua-de-giay.component';
import {MatDialog} from '@angular/material/dialog';
import {SoleService} from '../../../service/sole.service';
import {DegiayComponent} from '../degiay.component';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-de-giay-action',
  templateUrl: './de-giay-action.component.html',
  styleUrls: ['./de-giay-action.component.css']
})
export class DeGiayActionComponent implements ICellRendererAngularComp, OnInit {

  params: any;
  rowData = [];
  agInit(params: any){
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }

  constructor(private matdialog: MatDialog,
              private slsv: SoleService,
              private cdr: ChangeDetectorRef,
              private degiayComponent: DegiayComponent) { }

  ngOnInit(): void {
    this.getAllSole();
  }
  getAllSole(){
    this.slsv.getAllSole().subscribe(result => {
      this.rowData = result;
    });
  }
  openUpdate() {
    const dialogref = this.matdialog.open(SuaDeGiayComponent, {
      width: '65vh',
      height: '75vh',
      data: this.params
    });
    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'saveSole') {
        this.degiayComponent.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }
  deleteSole(sole?: any) {
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
    sole = this.params.id;
    console.log(sole);
    this.slsv.DeleteSole(sole).subscribe(() => {
      this.degiayComponent.ngOnInit();
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
