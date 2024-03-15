export class OrderDetail{
  idOrder?: string;
  idProductDetail?: number;
  quantity?: string;
  price?: number;

  constructor(idOrder: string, idProductDetail: number, quantity: string, price: number) {
    this.idOrder = idOrder;
    this.idProductDetail = idProductDetail;
    this.quantity = quantity;
    this.price = price;
  }
}
