import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiUrl';
import {OrderDetail} from '../component/model/OrderDetail';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {

  constructor(private http: HttpClient) { }
  getAllOrderDetailByOrder(idOrder: number): Observable<any>{
    return this.http.get(`${apiURL}get-order-detail/by-order/${idOrder}`);
  }
  createDetailSales(orderDetail: OrderDetail): Observable<any>{
    return this.http.post('http://localhost:6868/sales-counter/api/create-order-detail', orderDetail);
  }
  sendEmailFromCustomer(obj): Observable<any> {
    return this.http.post(`http://localhost:6868/view/api/send-email-from-customer`, obj);
  }
}
