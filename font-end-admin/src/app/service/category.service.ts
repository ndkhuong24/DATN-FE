import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  getAllCategory(): Observable<any>{
    return this.http.get(`${apiURL}category/hien-thi`);
  }
  AddCategory(category: any): Observable<any>{
    return this.http.post(`${apiURL}category/add`, category);
  }
  UpdateCategory(id: number, category: any): Observable<any>{
    return this.http.put(`${apiURL}category/update/${id}`, category);
  }
  DeleteCategory(id: number): Observable<any>{
    return this.http.delete(`${apiURL}category/delete/${id}`);
  }
}
