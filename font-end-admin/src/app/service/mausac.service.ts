import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiUrl';
@Injectable({
  providedIn: 'root'
})
export class MausacService {

  constructor(private http: HttpClient) { }
  getAllMauSac(): Observable<any>{
    return this.http.get(`${apiURL}color/hien-thi`);
  }
  AddMauSac(category: any): Observable<any>{
    return this.http.post(`${apiURL}color/add`, category);
  }
  UpdateMauSac(id: number, category: any): Observable<any>{
    return this.http.put(`${apiURL}color/update/${id}`, category);
  }
  DeleteMauSac(id: number): Observable<any>{
    return this.http.delete(`${apiURL}color/delete/${id}`);
  }
}
