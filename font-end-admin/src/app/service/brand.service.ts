import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiUrl';
@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }
  getAllBrand(): Observable<any>{
    return  this.http.get(`${apiURL}brand/hien-thi`);
  }
  AddBrand(brand: any): Observable<any>{
    return this.http.post(`${apiURL}brand/add`, brand);
  }
  UpdateBrand(id: number, brand: any): Observable<any>{
    return this.http.put(`${apiURL}brand/update/${id}`, brand);
  }
  DeleteBrand(id: number): Observable<any>{
    return this.http.delete(`${apiURL}brand/delete/${id}`);
  }
}
