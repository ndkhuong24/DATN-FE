import {CustomerSalesDTO} from './CustomerSalesDTO';

export class Order{
  id?: number;
  code?: string;
  idCustomer?: number;
  idStaff?: number;
  codeVoucher?: string;
  createDate?: string;
  paymentDate?: string;
  deliveryDate?: string;
  receivedDate?: string;
  addressReceived?: string;
  shipperPhone?: string;
  receiverPhone?: string;
  receiver?: string;
  shipPrice?: number;
  totalPrice?: number;
  totalPayment?: number;
  type?: number;
  paymentType?: number;
  description?: string;
  statusPayment?: number;
  status?: number;
  customerDTO?: CustomerSalesDTO;
  email?: string;
}
