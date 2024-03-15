import { Component, OnInit } from '@angular/core';
import {UsersDTO} from '../../component/model/UsersDTO';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: UsersDTO = {};
  infor: string;
  constructor() { }
  openedNewComponent = false;

  public openNewComponent() {
    this.openedNewComponent = true;
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('users'));
    this.infor = this.user.fullname;
  }

}
