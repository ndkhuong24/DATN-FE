import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL, HTTP_OPTIONS } from '../config/apiUrl';
import { HttpClient } from '@angular/common/http';
import { Order } from '../component/model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  getAllOrderAdmin(obj: { code: any; dateFrom: string; dateTo: string; status: number; }): Observable<any> {
    return this.http.post(`${apiURL}get-all-order`, obj);
  }
  totalStatusOrderAdmin(obj): Observable<any> {
    return this.http.post(`${apiURL}total-status-order`, obj);
  }

  cancelOrder(obj: { id: any; idStaff: any; note: any; }): Observable<any> {
    return this.http.post(`${apiURL}cancel-order`, obj);
  }

  progressingOrder(obj: { id: any; idStaff: any; note: any; }): Observable<any> {
    return this.http.post(`${apiURL}progressing-order`, obj);
  }

  completeOrder(obj: { id: any; idStaff: any; note: any; }): Observable<any> {
    return this.http.post(`${apiURL}complete-order`, obj);
  }

  shipOrder(obj: { id: any; idStaff: any; note: any; }): Observable<any> {
    return this.http.post(`${apiURL}ship-order`, obj);
  }

  missedOrder(obj: { id: any; idStaff: any; note: any; }): Observable<any> {
    return this.http.post(`${apiURL}missed-order`, obj);
  }

  createOrderSales(order: Order): Observable<any> {
    return this.http.post<any>('http://localhost:8081/sales-counter/api/create-order', order);
  }

  getAllOrderSalesAdmin(obj: { code: any; dateFrom: string; dateTo: string; status: number; }): Observable<any> {
    return this.http.post(`http://localhost:8081/sales-counter/api/get-all-order`, obj);
  }
}
