import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UsersDTO} from '../component/model/UsersDTO';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerInforService {
  id: number;
  infoCustomer: UsersDTO;
  constructor(private http: HttpClient) { }
  updateInfor(customerDTO: UsersDTO): Observable<any>{
    const storedUsers = localStorage.getItem('users');
    this.infoCustomer = JSON.parse(storedUsers);
    this.id = this.infoCustomer.id;
    return this.http.put('http://localhost:6868/view/api/update-infor/' + this.id, customerDTO);
  }
  changePass(customerDTO: UsersDTO): Observable<any>{
    const storedUsers = localStorage.getItem('users');
    this.infoCustomer = JSON.parse(storedUsers);
    this.id = this.infoCustomer.id;
    return this.http.put('http://localhost:6868/view/api/changePass/' + this.id, customerDTO);
  }
  sendMailOTP(customerDTO: UsersDTO): Observable<any> {
    return this.http.post('http://localhost:6868/view/api/send-mail-otp', customerDTO);
  }
  verifyOTP(cutomerDTO: UsersDTO): Observable<any> {
    return this.http.post('http://localhost:6868/view/api/verify-otp', cutomerDTO);
  }
  resetPass(cutomerDTO: UsersDTO): Observable<any> {
    return this.http.post('http://localhost:6868/view/api/reset-pass', cutomerDTO);
  }
}
