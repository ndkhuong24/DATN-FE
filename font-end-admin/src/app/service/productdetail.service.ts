import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ProductdetailService {

  constructor(private http: HttpClient) {
  }
  getAllProductDetail(): Observable<any>{
    return  this.http.get(`${apiURL}PrdDetail/hien-thi`);
  }
  getProductDetails(idColor: number, idSize: number) {
    return this.http.get(`${apiURL}PrdDetail/details/${idColor}/${idSize}`);
  }
  CreateProductDetail(product: any): Observable<any>{
    return this.http.post(`${apiURL}PrdDetail/add`, product);
  }
  UpdateProductDetail(id: number, product: any): Observable<any>{
    return this.http.put(`${apiURL}PrdDetail/update/${id}`, product);
  }
  DeleteProductDetail(id: number): Observable<any>{
    return this.http.delete(`${apiURL}PrdDetail/delete/${id}`);
  }
}
