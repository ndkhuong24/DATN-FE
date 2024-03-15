import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {apiURL, HTTP_OPTIONS} from '../config/apiUrl';
import {HttpClient} from '@angular/common/http';
import {Order} from '../component/model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  getAllOrderAdmin(obj): Observable<any> {
    return this.http.post(`${apiURL}get-all-order`, obj);
  }
  totalStatusOrderAdmin(obj): Observable<any> {
    return this.http.post(`${apiURL}total-status-order`, obj);
  }

  cancelOrder(obj): Observable<any> {
    return this.http.post(`${apiURL}cancel-order`, obj);
  }
  progressingOrder(obj): Observable<any> {
    return this.http.post(`${apiURL}progressing-order`, obj);
  }
  completeOrder(obj): Observable<any> {
    return this.http.post(`${apiURL}complete-order`, obj);
  }
  shipOrder(obj): Observable<any> {
    return this.http.post(`${apiURL}ship-order`, obj);
  }
  missedOrder(obj): Observable<any> {
    return this.http.post(`${apiURL}missed-order`, obj);
  }
  createOrderSales(order: Order): Observable<any>{
    return this.http.post<any>('http://localhost:6868/sales-counter/api/create-order', order);
  }
  getAllOrderSalesAdmin(obj): Observable<any> {
    return this.http.post(`http://localhost:6868/sales-counter/api/get-all-order`, obj);
  }
}
