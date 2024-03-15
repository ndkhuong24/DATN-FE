import {HttpHeaders} from '@angular/common/http';

export const apiURL = 'http://localhost:6868/view/api/';

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('login')!)}`
  }),
};
