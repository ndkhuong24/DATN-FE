import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  constructor(private http: HttpClient) {
  }

  getAllSize(): Observable<any> {
    return this.http.get(`${apiURL}get-all-size`);
  }
}
