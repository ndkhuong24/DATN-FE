import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {
  }

  sendEmail(obj): Observable<any> {
    return this.http.post(`http://localhost:6868/view/api/send-email-completeOrder`, obj);
  }
  sendEmailNotLogin(obj): Observable<any> {
    return this.http.post(`${apiURL}send-email-completeOrder/not-login`, obj);
  }

}
