import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL, HTTP_OPTIONS} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPayment(amount: number): Observable<any>{
    return this.http.get(`${apiURL}create-payment?amount=${amount}`);
  }
}
