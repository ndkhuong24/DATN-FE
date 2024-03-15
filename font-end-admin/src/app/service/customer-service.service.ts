import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsersDTO} from '../component/model/UsersDTO';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  constructor(private http: HttpClient) { }
  findCustomerByPhone(phone: string): Observable<any>{
    return this.http.get('http://localhost:6868/sales-customer/findByPhone/' + phone);
  }
  addCustomerSC(customer: UsersDTO): Observable<any>{
    return this.http.post('http://localhost:6868/sales-customer/add-customer', customer);
  }
}
