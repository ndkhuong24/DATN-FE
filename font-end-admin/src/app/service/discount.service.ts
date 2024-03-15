import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {apiURL} from "../config/apiUrl";

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private apiUrl = 'http://localhost:6868/api/admin/discount';
  private apiUrl2 = 'http://localhost:6868/api/admin/discount/kichHoat';


  constructor(private http: HttpClient) {}

  getSomeData() {
    return this.http.get<any[]>(this.apiUrl);
  }
  getProduct() {
    return this.http.get<any[]>('http://localhost:6868/api/admin/discount/product');
  }
  getDiscountKH() {
    return this.http.get<any[]>('http://localhost:6868/api/admin/discount/KH');
  }
  getDiscountKKH() {
    return this.http.get<any[]>('http://localhost:6868/api/admin/discount/KKH');
  }
  exportExcel(): Observable<Blob> {
    return this.http.get('http://localhost:6868/api/admin/discount/discount/export-data',{responseType: 'blob' });
  }

  updateDiscount(id: number, discount: any) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, discount);
  }

  searchByDate(obj): Observable<any> {
    return this.http.get<any>(`http://localhost:6868/api/admin/discount/searchByDate?fromDate=${obj.fromDate}&toDate=${obj.toDate}` );
  }




  searchByDiscount(search: string): Observable<any> {
    const params = new HttpParams()
      .set('search', search);
    return this.http.get<any>(`http://localhost:6868/api/admin/discount/searchByDiscount`, { params });
  }
  searchByProduct(search: string): Observable<any> {
    const params = new HttpParams()
      .set('search', search);
    return this.http.get<any>(`http://localhost:6868/api/admin/discount/searchByProduct`, { params });
  }
  searchByBrand(search: string): Observable<any> {
    const params = new HttpParams()
      .set('search', search);
    return this.http.get<any>(`http://localhost:6868/api/admin/discount/searchByBrand`, { params });
  }
  searchByCategory(search: string): Observable<any> {
    const params = new HttpParams()
      .set('search', search);
    return this.http.get<any>(`http://localhost:6868/api/admin/discount/searchByCategory`, { params });
  }
  KichHoat(id: number ): Observable<any> {
    const url = `${this.apiUrl}/kichHoat/${id}`;
    return this.http.put(url, null);
  }
  setIdel(id: number ): Observable<any> {
    const url = `${this.apiUrl}/setIdel/${id}`;
    return this.http.put(url, null);
  }


  getDetailDiscount(discountId: number) {
    const url = `${this.apiUrl}/${discountId}`;
    return this.http.get<any[]>(url);
  }
  deleteDiscount(discountId: number) {
    const url = `${this.apiUrl}/${discountId}`;
    return this.http.delete<any[]>(url);
  }

  createDiscount(discount: any): Observable<any> {
    return this.http.post(this.apiUrl, discount);
  }
}

