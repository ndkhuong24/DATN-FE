import * as moment from 'moment';

export function formatMoney(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

export function formatDate(originalDate: string): string {
  const date = new Date(originalDate);
  return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
}

export function formatTime(originalDate: string): string {
  const date = new Date(originalDate);
  date.setHours(date.getHours() + 5);
  return moment(date).format('HH:mm:ss');
}

export function formatDateTime(originalDate: string): string {
  const date = new Date(originalDate);
  date.setHours(date.getHours() + 5);
  const d = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  const t = moment(date).format('HH:mm:ss');
  return `${t} ${d}`;
}

export function formatNumber(value) {
  const roundedValue = Number(value.toFixed(2));
  return roundedValue.toLocaleString('en-US');
}

export function padZero(number) {
  if (number > 0 && number < 10) {
    return '0' + number;
  }
  return number.toLocaleString('en-US');
}
