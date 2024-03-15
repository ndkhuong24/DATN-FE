import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {apiURL} from '../config/apiURL';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private totalProductsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalProducts$: Observable<number> = this.totalProductsSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  getCart(productId: number, sizeId: number, colorId: number, quantity: number): Observable<any> {
    const cart = {
      'productId': productId,
      'productDetailDTO': {
        'colorDTO': {
          'id': colorId
        },
        'sizeDTO': {
          'id': sizeId
        }
      },
      'quantity': quantity
    };
    return this.http.post(`${apiURL}cart`, cart);
  }

  updateTotalProducts(totalProducts: number) {
    this.totalProductsSubject.next(totalProducts);
  }
}
