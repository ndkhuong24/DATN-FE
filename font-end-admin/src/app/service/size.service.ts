import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../config/apiUrl';
@Injectable({
  providedIn: 'root'
})
export class SizeService {
  constructor(private http: HttpClient) { }

  getAllSize(): Observable<any> {
    return this.http.get(`${apiURL}size/hien-thi`);
  }

  AddSize(sole: any): Observable<any> {
    return this.http.post(`${apiURL}size/add`, sole);
  }

  UpdateSize(id: number, sole: any): Observable<any> {
    return this.http.put(`${apiURL}size/update/${id}`, sole);
  }

  DeleteSize(id: number): Observable<any> {
    return this.http.delete(`${apiURL}size/delete/${id}`);
  }

  exportData(): Observable<Blob> {
    return this.http.get(`${apiURL}size/export-data`, {
      responseType: 'blob'
    });
  }

  exportDataTemplate(): Observable<Blob> {
    return this.http.get(`${apiURL}size/export-data-template`, {
      responseType: 'blob'
    });
  }

  onUpload(formData: FormData): Observable<string> {
    return this.http.post(`${apiURL}size/import-data`, formData, { responseType: 'text' });
  }
}
