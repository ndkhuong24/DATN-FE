import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailService } from 'src/app/service/order-detail.service';
import { OrderService } from 'src/app/service/order.service';
import { PaymentService } from 'src/app/service/payment.service';

@Component({
    selector: 'app-vnpay-return',
    templateUrl: './vnpay-return.component.html',
    styleUrls: ['./vnpay-return.component.css']
})

export class VnpayReturnComponent implements OnInit {
    paymentResult: string = '';

    constructor(
        private route: ActivatedRoute,
        private paymentSalesService: PaymentService,
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
                } else {
                    this.paymentResult = 'fail';
                }
            },
        );
    }

}
