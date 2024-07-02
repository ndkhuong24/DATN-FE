import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailService } from 'src/app/service/order-detail.service';
import { OrderService } from 'src/app/service/order.service';
import { PaymentSalesService } from 'src/app/service/payment-sales.service';

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
                    const listCartJson = localStorage.getItem('listCart');

                    if (orderJson) {
                        const order = JSON.parse(orderJson);
                        const listCart = JSON.parse(listCartJson);

                        this.orderService.createOrderSales(order).subscribe(
                            (response) => {
                                const saveIdOrder = response.data.id;

                                for (let i = 0; i < listCart.length; i++) {

                                    const orderDetail = {
                                        idOrder: saveIdOrder,
                                        idProductDetail: listCart[i].productDetailId,
                                        quantity: listCart[i].quantity,
                                        price: listCart[i].price,
                                    };

                                    this.orderDetailService.createDetailSales(orderDetail).subscribe(res => {
                                        if (res.status === 'OK') {
                                            localStorage.removeItem('listProductPush');
                                            // this.refreshData();
                                            // this.removeOrder(order);
                                            // this.calculateTotalAllProducts();
                                            localStorage.removeItem('orderProducts_1');
                                            localStorage.removeItem('orderProducts_2');
                                            localStorage.removeItem('orderProducts_3');
                                            localStorage.removeItem('orderProducts_4');
                                            localStorage.removeItem('orderProducts_5');
                                            localStorage.removeItem('order');
                                            localStorage.removeItem('coutOrder');
                                            // localStorage.setItem('coutOrder', this.count.toString());
                                            localStorage.removeItem('listOrder');
                                            localStorage.removeItem('listCart');
                                        } else {
                                            return;
                                        }
                                    });
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
