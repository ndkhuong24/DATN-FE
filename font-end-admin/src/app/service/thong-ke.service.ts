import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ThongKeService {

  constructor(private http: HttpClient) { }
  getStatisticalByYear(obj): Observable<any> {
    return this.http.post(`${apiURL}get-statistical-by-year`, obj);
  }
}
