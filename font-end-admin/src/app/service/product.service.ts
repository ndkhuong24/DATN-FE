import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../config/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getAllProduct(): Observable<any> {
    return this.http.get(`${apiURL}product/hien-thi`);
  }

  // getAllProductAll(): Observable<any> {
  //   return this.http.get(`${apiURL}product/hien-thii`);
  // }

  CreateProduct(product: any): Observable<any> {
    return this.http.post(`${apiURL}product/add`, product);
  }

  UpdateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${apiURL}product/update/${id}`, product);
  }

  DeleteProduct(id: number): Observable<any> {
    return this.http.delete(`${apiURL}product/delete/${id}`);
  }

  GetProduct(id: number): Observable<any> {
    return this.http.get(`${apiURL}product/detail/${id}`);
  }
  getProductDetails(productId: number) {
    return this.http.get<any[]>(`${apiURL}product-details/${productId}`);
  }

  searchProductNameOrCode(search: string): Observable<any> {
    const params = new HttpParams().set('search', search);
    return this.http.get(`${apiURL}product/hien-thii?` + params);
  }
  searchProduct(param: string): Observable<any> {
    return this.http.get(`${apiURL}product/search/` + param);
  }
  
  activateProduct(productId: number): Observable<any> {
    const url = `${apiURL}product/${productId}/activate`;
    return this.http.put(url, null);
  }

  deactivateProduct(productId: number): Observable<any> {
    const url = `${apiURL}product/${productId}/deactivate`;
    return this.http.put(url, null);
  }


  exportExcelProduct(): Observable<Blob> {
    return this.http.get(apiURL + `product/export-data`, { responseType: 'blob' });
  }

  exportExcelProductTemplate(): Observable<Blob> {
    return this.http.get(apiURL + `product/export-data-template`, { responseType: 'blob' });
  }

  importExcelProduct(formData: FormData, typeImport) {
    return this.http.post(`${apiURL}product/import?typeImport=${typeImport}`, formData);
  }

  exportExcelProductErrors(listError: any): Observable<Blob> {
    return this.http.post(`${apiURL}product/exportDataErrors`, listError, { responseType: 'blob' });
  }

  // uploadImgProduct(formData: FormData, idProduct) {
  //   return this.http.post(`${apiURL}upload-img-file?idProduct=${idProduct}`, formData);
  // }

  // uploadImgProduct(file: File, idProduct: number): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append('image', file);
  //   formData.append('idProduct', idProduct.toString());

  //   const headers = new HttpHeaders();
  //   headers.append('Content-Type', 'multipart/form-data');

  //   return this.http.post(`http://localhost:8081/api/admin/images/upload`, formData, { headers });
  // }

  uploadImgProduct(file: File, idProduct: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('idProduct', idProduct.toString());

    return this.http.post(`${apiURL}images/upload`, formData);
  }
}
