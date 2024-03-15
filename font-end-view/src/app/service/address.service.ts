import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) {
  }

  createAddress(obj): Observable<any> {
    return this.http.post(`${apiURL}create-address`, obj);
  }
  getAllAddress(obj): Observable<any>{
    return  this.http.post(`${apiURL}get-all-address`, obj);
  }
  getAddress(obj): Observable<any>{
    return  this.http.post(`${apiURL}get-address`, obj);
  }
  updateAddressConfig(obj): Observable<any>{
    return  this.http.post(`${apiURL}update-address/config`, obj);
  }
  detailAddress(id: number): Observable<any>{
    return  this.http.get(`${apiURL}detail-address/${id}`);
  }

}
