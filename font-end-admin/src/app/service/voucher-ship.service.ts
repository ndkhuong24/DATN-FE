import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherShipService {
  private apiUrl = 'http://localhost:6868/api/admin/voucherFS';
  constructor(private http: HttpClient) {}

  getSomeData() {
    return this.http.get<any[]>(this.apiUrl);
  }
  getCustomer() {
    return this.http.get<any[]>('http://localhost:6868/api/admin/voucherFS/customer');
  }
  exportExcel(): Observable<Blob> {
    return this.http.get('http://localhost:6868/api/admin/voucherFS/export-data',{ responseType: 'blob' });
  }
  updateVoucher(id, voucher: any) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, voucher);
  }
  getDetailVoucher(voucherId: number) {
    const url = `${this.apiUrl}/${voucherId}`;
    return this.http.get<any[]>(url);
  }
  deleteVoucher(voucherId: number) {
    const url = `${this.apiUrl}/${voucherId}`;
    return this.http.delete(url);
  }

  createVoucher(voucher: any): Observable<any> {
    return this.http.post(this.apiUrl, voucher);
  }
  KichHoat(id: number ): Observable<any> {
    const url = `${this.apiUrl}/kichHoat/${id}`;
    return this.http.put(url, null);
  }
  setIdel(id: number ): Observable<any> {
    const url = `${this.apiUrl}/setIdel/${id}`;
    return this.http.put(url, null);
  }
  getVoucherKH() {
    return this.http.get<any[]>('http://localhost:6868/api/admin/voucherFS/KH');
  }
  sendEmail(voucher: any): Observable<any> {
    const urlEmail = `${this.apiUrl}/sendEmail`;
    return this.http.post(urlEmail, voucher);
  }
  getVoucherKKH() {
    return this.http.get<any[]>('http://localhost:6868/api/admin/voucherFS/KKH');
  }
  searchByDate(obj): Observable<any> {
    return this.http.get<any>(`http://localhost:6868/api/admin/voucherFS/searchByDate?fromDate=${obj.fromDate}&toDate=${obj.toDate}` );
  }
  searchByCustomer(search: string): Observable<any> {
    const params = new HttpParams()
      .set('search', search);
    return this.http.get<any>(`${this.apiUrl}/searchByCustomer`, { params });
  }
  searchByVoucher(search: string): Observable<any> {
    const params = new HttpParams()
      .set('search', search);
    return this.http.get<any>(`http://localhost:6868/api/admin/voucherFS/searchByVoucherFS`, { params });
  }
}

