import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiURL } from '../config/apiURL';

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

  getCartCustomer(id: any): Observable<any>  {
    return this.http.get(`${apiURL}get-cart-to-customer/` + id);
  }

  updateTotalProducts(totalProducts: number){
    this.totalProductsSubject.next(totalProducts);
  }

  addToCartCustomer(product: number, colorId: number, sizeId: number, quantityBuy: number, id: any) {
    const cartCurrent = {
      'idProduct': product,
      'idColor': colorId,
      'idSize': sizeId,
      'quantity': quantityBuy,
      'idCustomer': id,
    }
    return this.http.post(`${apiURL}add-to-cart`, cartCurrent);
  }

  giamSoLuong(productId: any, idColor: any, idSize: any, id: any) {
    const cartCurrent = {
      'idProduct': productId,
      'idColor': idColor,
      'idSize': idSize,
      'idCustomer': id,
    }
    return this.http.post(`${apiURL}giam-so-luong`, cartCurrent);
  }

  tangSoLuong(productId: any, idColor: any, idSize: any, id: any) {
    const cartCurrent = {
      'idProduct': productId,
      'idColor': idColor,
      'idSize': idSize,
      'idCustomer': id,
    }
    return this.http.post(`${apiURL}tang-so-luong`, cartCurrent);
  }

  xoa(productId: any, idColor: any, idSize: any, id: any) {
    const params = new HttpParams()
      .set('idProduct', productId)
      .set('idColor', idColor)
      .set('idSize', idSize)
      .set('idCustomer', id);
  
    return this.http.delete(`${apiURL}xoa`, { params: params });
  }  

  // xoa(productId: any, idColor: any, idSize: any, id: any) {
  //   const cartCurrent = {
  //     'idProduct': productId,
  //     'idColor': idColor,
  //     'idSize': idSize,
  //     'idCustomer': id,
  //   }
  //   return this.http.delete(`${apiURL}xoa`, cartCurrent);
  // }
}
