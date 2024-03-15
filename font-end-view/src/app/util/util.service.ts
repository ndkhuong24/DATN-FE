import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }
   formatMoney(value: number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  }

   formatDate(originalDate: string): string {
    const date = new Date(originalDate);
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }

   formatTime(originalDate: string): string {
    const date = new Date(originalDate);
    return moment(date).format('HH:mm:ss');
  }

  formatDateTime(originalDate: string): string {
    const date = new Date(originalDate);
    const d = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    const t = moment(date).format('HH:mm:ss');
    return `${t} ${d}`;
  }

  formatNumber(value) {
    const roundedValue = Number(value.toFixed(2));
    return roundedValue.toLocaleString('en-US');
  }

  padZero(number) {
    if (number > 0 && number < 10) {
      return '0' + number;
    }
    return number.toLocaleString('en-US');
  }

}
