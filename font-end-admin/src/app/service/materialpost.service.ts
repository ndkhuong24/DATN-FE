import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../config/apiUrl';
@Injectable({
  providedIn: 'root',
})
export class MaterialpostService {
  constructor(private http: HttpClient) { }

  getAllMaterial(): Observable<any> {
    return this.http.get(`${apiURL}material/hien-thi`);
  }


  CreateMaterial(material: any): Observable<any> {
    return this.http.post(`${apiURL}material/add`, material);
  }

  UpdateMaterial(id: number, material: any): Observable<any> {
    return this.http.put(`${apiURL}material/update/${id}`, material);
  }

  DeleteMaterial(id: number): Observable<any> {
    return this.http.delete(`${apiURL}material/delete/${id}`);
  }

  exportData(): Observable<Blob> {
    return this.http.get(`${apiURL}material/export-data`, {
      responseType: 'blob'
    });
  }

  exportDataTemplate(): Observable<Blob> {
    return this.http.get(`${apiURL}material/export-data-template`, {
      responseType: 'blob'
    });
  }

  onUpload(formData: FormData): Observable<string> {
    return this.http.post(`${apiURL}material/import-data`, formData, { responseType: 'text' });
  }
}
