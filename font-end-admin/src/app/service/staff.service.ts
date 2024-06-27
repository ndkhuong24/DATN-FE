import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from '../config/apiUrl';
import { Observable } from 'rxjs';
import { UsersDTO } from '../component/model/UsersDTO';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private http: HttpClient) { }
  
  getAllStaff(): Observable<any> {
    return this.http.get(`${apiURL}staff-getall`);
  }

  finById(id: string): Observable<any> {
    return this.http.get('http://localhost:8081/view/api/staff/finbyId/' + id);
  }

  addStaff(staff: UsersDTO): Observable<any> {
    return this.http.post('http://localhost:8081/admin/api/sign-up', staff);
  }

  updateStaff(id: number, staff: UsersDTO): Observable<any> {
    return this.http.put('http://localhost:8081/api/admin/staff-update/' + id, staff);
  }

  findByCodeOrPhoneLike(param: string): Observable<any> {
    return this.http.get('http://localhost:8081/api/admin/staff-search/' + param);
  }
}

