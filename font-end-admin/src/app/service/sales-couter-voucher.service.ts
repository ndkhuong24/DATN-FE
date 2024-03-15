import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesCouterVoucherService {

  constructor(private http: HttpClient) { }

  getAllVoucherSales(obj): Observable<any>{
    return  this.http.post('http://localhost:6868/api/sc-voucher/get-all-voucher', obj);
  }
  getVoucherSales(code: string): Observable<any>{
    return this.http.get(`http://localhost:6868/api/sc-voucher/get-voucher?code=${code}`);
  }
}


