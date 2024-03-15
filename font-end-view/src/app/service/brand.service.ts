import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  getBrandTop(): Observable<any>{
    return this.http.get(`${apiURL}get-brand-top`);
  }

}
