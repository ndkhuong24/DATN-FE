import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailService } from 'src/app/service/order-detail.service';
import { OrderService } from 'src/app/service/order.service';
import { PaymentSalesService } from 'src/app/service/payment-sales.service';
import { OrderDetail } from '../../model/OrderDetail';

@Component({
    selector: 'app-vnpay-return',
    templateUrl: './vnpay-return.component.html',
    styleUrls: ['./vnpay-return.component.css']
})

export class VnpayReturnComponent implements OnInit {

    paymentResult: string = '';
    // listCart = [];

    constructor(
        private route: ActivatedRoute,
        private paymentSalesService: PaymentSalesService,
        private orderService: OrderService,
        private orderDetailService: OrderDetailService,
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const requestParams = {
                vnp_Amount: params['vnp_Amount'],
                vnp_BankCode: params['vnp_BankCode'],
                vnp_BankTranNo: params['vnp_BankTranNo'],
                vnp_CardType: params['vnp_CardType'],
                vnp_OrderInfo: params['vnp_OrderInfo'],
                vnp_PayDate: params['vnp_PayDate'],
                vnp_ResponseCode: params['vnp_ResponseCode'],
                vnp_TmnCode: params['vnp_TmnCode'],
                vnp_TransactionNo: params['vnp_TransactionNo'],
                vnp_TransactionStatus: params['vnp_TransactionStatus'],
                vnp_TxnRef: params['vnp_TxnRef'],
                vnp_SecureHash: params['vnp_SecureHash']
            };
            this.handlePaymentResponse(requestParams);
        });
    }

    handlePaymentResponse(requestParams: any) {
        this.paymentSalesService.handlePaymentResponse(requestParams).subscribe(
            (response: any) => {
                if (response.paymentStatus === 'success') {
                    this.paymentResult = 'success';

                    const orderJson = localStorage.getItem('order');
                    const currentOrderIdJson = localStorage.getItem('currentOrderId');

                    if (orderJson) {
                        const order = JSON.parse(orderJson);
                        const currentOrderId = JSON.parse(currentOrderIdJson);

                        this.orderService.createOrderSales(order).subscribe(
                            (response) => {
                                const saveIdOrder = response.data.id;

                                let listOrder = JSON.parse(localStorage.getItem('listOrder'));

                                if (listOrder) {
                                    let currentOrder = listOrder.find((order: any) => order.id === currentOrderId);

                                    if (currentOrder) {
                                        for (let product of currentOrder.productList) {
                                            const orderDetail: OrderDetail = {
                                                idOrder: saveIdOrder,
                                                idProductDetail: product.id,
                                                quantity: product.quantityInOrder,
                                                price: product.price,
                                            };

                                            this.orderDetailService.createDetailSales(orderDetail).subscribe(res => {
                                                if (res.status === 'OK') {
                                                    // Xoá dữ liệu trong productList của đơn hàng có id bằng currentOrderId
                                                    currentOrder.productList = [];

                                                    // Cập nhật listOrder trong localStorage
                                                    localStorage.setItem('listOrder', JSON.stringify(listOrder));

                                                    localStorage.removeItem('currentOrderId');
                                                    localStorage.removeItem('order');
                                                }
                                            });
                                        }
                                    } else {
                                        console.error('Current order not found');
                                    }
                                } else {
                                    console.error('listOrder not found in localStorage');
                                }
                            }
                        );

                    }
                } else {
                    this.paymentResult = 'fail';
                }
            },
        );
    }

}
