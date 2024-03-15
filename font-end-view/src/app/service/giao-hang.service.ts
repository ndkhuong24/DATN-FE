import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiaoHangService {

  httpOption = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      Token: '72053157-7347-11ee-af43-6ead57e9219a'
    }),
  };

  constructor(private http: HttpClient) {
  }

  // get all thành phố
  getAllProvince(): Observable<any> {
    return this.http.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', this.httpOption);
  }

  // get all quận huyện
  getAllDistrictByProvince(province: number): Observable<any> {
    const params = new HttpParams().set('province_id', province.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Token: '72053157-7347-11ee-af43-6ead57e9219a'
    });

    return this.http.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {headers, params});
  }

  // get all phường
  getAllWardByDistrict(districtId: number): Observable<any> {
    return this.http.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, this.httpOption);
  }

  getTinhPhiShip(obj): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Token: '72053157-7347-11ee-af43-6ead57e9219a',
      ShopId: '4655652'
    });
    const options = { headers: headers };
    return this.http.post(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`, obj, options);
  }
}
