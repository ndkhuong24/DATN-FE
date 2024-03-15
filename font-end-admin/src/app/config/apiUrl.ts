import {HttpHeaders} from '@angular/common/http';

export const apiURL = 'http://localhost:6868/api/admin/';

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('login')!)}`
  }),
};
