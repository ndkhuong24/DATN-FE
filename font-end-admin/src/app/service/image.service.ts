
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiURL} from '../config/apiUrl';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  UploadImage(image: File): Observable<any>{
    const formdata = new FormData();
    formdata.append('multipartFile', image);
    return this.http.post(`${apiURL}upload`, formdata);
  }
}
