import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignInFrom} from '../../component/model/SignInFrom';
import {Observable} from 'rxjs';
import {JwtResponse} from '../../component/model/JwtResponse';
import {SignUpRepquest} from '../../component/model/SignUpRepquest';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  private apiLogin = 'http://localhost:6868/view/api/sign-in';
  private apiSignUp = 'http://localhost:6868/view/api/sign-up';
  private apiFindByID: string;
  constructor(private httpClient: HttpClient){}
  signIn(signInForm: SignInFrom): Observable<JwtResponse>{
    return this.httpClient.post<JwtResponse>(this.apiLogin, signInForm);
  }
  signUp(signUpReuest: SignUpRepquest): Observable<any>{
    return this.httpClient.post(this.apiSignUp, signUpReuest);
  }
}
