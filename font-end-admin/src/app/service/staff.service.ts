import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiURL} from '../config/apiUrl';
import {Observable} from 'rxjs';
import {UsersDTO} from '../component/model/UsersDTO';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private http: HttpClient) { }
  getAllStaff(): Observable<any>{
    return this.http.get(`${apiURL}staff-getall`);
  }
  finById(id: string): Observable<any> {
    return this.http.get('http://localhost:6868/view/api/staff/finbyId/' + id);
  }
  addStaff(staff: UsersDTO): Observable<any>{
    return this.http.post('http://localhost:6868/admin/api/sign-up', staff);
  }
  updateStaff(id: string, staff: UsersDTO): Observable<any>{
    return this.http.put('http://localhost:6868/api/admin/staff-update/' + id , staff);
  }
  findByCodeOrPhoneLike(param: string): Observable<any>{
    return this.http.get('http://localhost:6868/api/admin/staff-search/' + param);
  }
}

