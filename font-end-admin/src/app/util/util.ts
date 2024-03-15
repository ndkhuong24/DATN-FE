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

export function formatDateYYYY_MM_dd(originalDate: string): string {
  const date = new Date(originalDate);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Tháng bắt đầu từ 0
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export function formatTime(originalDate: string): string {
  const date = new Date(originalDate);
  return moment(date).format('HH:mm:ss');
}

export function formatDateTime(originalDate: string): string {
  const date = new Date(originalDate);
  date.setHours(date.getHours() );
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

export function getFormattedDateCurrent(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}${month}${day}`;
}

export const MAX_FILE_SIZE_UPLOAD = 5242880;
