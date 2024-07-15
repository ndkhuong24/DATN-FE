import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPayment(amount: number): Observable<any>{
    return this.http.get(`${apiURL}create-payment?amount=${amount}`);
  }

  handlePaymentResponse(requestParams: any): Observable<any> {
    return this.http.get<any>(`${apiURL}vnpay-payment`, { params: requestParams });
  }
}
