import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentSalesService {

  constructor(private http: HttpClient) { }
  
  createPayment(amount: number): Observable<any> {
    return this.http.get(`http://localhost:8081/api/sales-couter/create-payment?amount=${amount}`);
  }

  handlePaymentResponse(requestParams: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8081/api/sales-couter/vnpay-payment`, { params: requestParams });
  }
}
