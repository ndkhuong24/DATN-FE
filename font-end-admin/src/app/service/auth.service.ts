import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignForm} from '../component/model/SignForm';
import {Observable} from 'rxjs';
import {JwtResponse} from '../component/model/JwtResponse';
import {SignUpRepquest} from '../component/model/SignUpRepquest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiLogin = 'http://localhost:6868/admin/api/sign-in';
  private apiSignUp = 'http://localhost:6868/admin/api/sign-up';
  constructor(private httpClient: HttpClient){ }
  signIn(signInForm: SignForm): Observable<JwtResponse>{
    return this.httpClient.post<JwtResponse>(this.apiLogin, signInForm);
  }
  signUp(signUpReuest: SignUpRepquest): Observable<any>{
    return this.httpClient.post(this.apiSignUp, signUpReuest);
  }
}
