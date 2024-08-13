import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../config/apiUrl';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class SoleService {
  constructor(
    private http: HttpClient,
    private toaStr: ToastrService
  ) { }

  getAllSole(): Observable<any> {
    return this.http.get(`${apiURL}sole/hien-thi`);
  }

  AddSole(sole: any): Observable<any> {
    return this.http.post(`${apiURL}sole/add`, sole);
  }

  UpdateSole(id: number, sole: any): Observable<any> {
    return this.http.put(`${apiURL}sole/update/${id}`, sole);
  }

  DeleteSole(id: number): Observable<any> {
    return this.http.delete(`${apiURL}sole/delete/${id}`);
  }

  exportData(): Observable<Blob> {
    return this.http.get(`${apiURL}sole/export-data`, {
      responseType: 'blob'
    });
  }

  exportDataTemplate(): Observable<Blob> {
    return this.http.get(`${apiURL}sole/export-data-template`, {
      responseType: 'blob'
    });
  }

  onUpload(formData: FormData): Observable<string> {
    return this.http.post(`${apiURL}sole/import-data`, formData, { responseType: 'text' });
  }
}
