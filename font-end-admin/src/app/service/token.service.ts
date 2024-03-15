import { Injectable } from '@angular/core';
const USER_KEY = 'username_key';
const TOKEN_KEY = 'token_key';
const ROLE_KEY = 'role_key';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() { }

  public setUser(user: string) {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, user);
  }
  public getUser(){
    return localStorage.getItem(USER_KEY);
  }
  // token
  public setToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(){
    return localStorage.getItem(TOKEN_KEY);
  }
  // role
  public setRoles(role: string) {
    localStorage.removeItem(ROLE_KEY);
    localStorage.setItem(ROLE_KEY, role);
  }
  public getRole(){
    return localStorage.getItem(ROLE_KEY);
  }
}
