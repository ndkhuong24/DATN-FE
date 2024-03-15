import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoucherShipService {

  constructor(private http: HttpClient) { }
  getAllVoucherShip(obj): Observable<any>{
    return this.http.post(`${apiURL}get-all-voucher-ship`, obj);
  }
  getVoucherShip(code: string): Observable<any>{
    return this.http.get(`${apiURL}get-voucher-ship?code=${code}`);
  }
}
