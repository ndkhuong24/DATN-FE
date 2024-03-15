import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductNoiBatByBrand(idBrand?: number): Observable<any>{
    return this.http.get(`${apiURL}get-product-noi-bat?idBrand=${idBrand}`);
  }
  getProductTuongTu(idProduct?: number, idCategory?: number): Observable<any>{
    return this.http.get(`${apiURL}get-product-tuong-tu?idProduct=${idProduct}&idCategory=${idCategory}`);
  }

  getDetailProduct(idProduct: number): Observable<any>{
    return this.http.get(`${apiURL}get-detail-product/${idProduct}`);
  }


}
