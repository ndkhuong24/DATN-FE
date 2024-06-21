import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../config/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class VoucherShipService {
  private apiUrl = 'http://localhost:8081/api/admin/voucherFS';
  constructor(private http: HttpClient) {}

  getSomeData() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllVoucher(): Observable<any> {
    return this.http.get(`${apiURL}voucherFS`);
  }

  getCustomer() {
    return this.http.get<any[]>(
      'http://localhost:8081/api/admin/voucherFS/customer'
    );
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(
      'http://localhost:8081/api/admin/voucherFS/export-data',
      { responseType: 'blob' }
    );
  }

  updateVoucher(id: any, voucher: any) {
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

  KichHoat(id: number): Observable<any> {
    const url = `${this.apiUrl}/kichHoat/${id}`;
    return this.http.put(url, null);
  }

  setIdel(id: number): Observable<any> {
    const url = `${this.apiUrl}/setIdel/${id}`;
    return this.http.put(url, null);
  }

  getVoucherKH() {
    return this.http.get<any[]>('http://localhost:8081/api/admin/voucherFS/KH');
  }

  sendEmail(voucher: any): Observable<any> {
    const urlEmail = `${this.apiUrl}/sendEmail`;
    return this.http.post(urlEmail, voucher);
  }

  getVoucherKKH() {
    return this.http.get<any[]>(
      'http://localhost:8081/api/admin/voucherFS/KKH'
    );
  }

  searchByDate(obj: { fromDate: any; toDate: any }): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8081/api/admin/voucherFS/searchByDate?fromDate=${obj.fromDate}&toDate=${obj.toDate}`
    );
  }

  searchByCustomer(search: string): Observable<any> {
    const params = new HttpParams().set('search', search);
    return this.http.get<any>(`${this.apiUrl}/searchByCustomer`, { params });
  }

  searchByVoucher(search: string): Observable<any> {
    const params = new HttpParams().set('search', search);
    return this.http.get<any>(
      `http://localhost:8081/api/admin/voucherFS/searchByVoucherFS`,
      { params }
    );
  }
}
