import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(private http: HttpClient) { }

  getAllVoucher(obj): Observable<any>{
    return this.http.post(`${apiURL}get-all-voucher`, obj);
  }
  getVoucher(code: string): Observable<any>{
    return this.http.get(`${apiURL}get-voucher?code=${code}`);
  }
}
