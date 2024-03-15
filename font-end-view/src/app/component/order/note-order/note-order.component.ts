import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-note-order',
  templateUrl: './note-order.component.html',
  styleUrls: ['./note-order.component.css']
})
export class NoteOrderComponent implements OnInit {

  note: string = null;
  constructor(public matRef: MatDialogRef<NoteOrderComponent>) { }

  ngOnInit(): void {
  }

  xacNhan() {
    this.matRef.close({event: 'close-note', data: {note: this.note}});
  }
}
