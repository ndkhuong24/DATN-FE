import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CustomerServiceService } from "src/app/service/customer-service.service";
import { OrderDetailService } from "src/app/service/order-detail.service";
import { OrderService } from "src/app/service/order.service";
import { VoucherShipService } from "src/app/service/voucher-ship.service";
import { padZero } from "src/app/util/util";
import { UtilService } from "src/app/util/util.service";
import { PogupVoucherSCComponent } from "../../sales-counter/pogup-voucher-sc/pogup-voucher-sc.component";
import { SalesCouterVoucherService } from "src/app/service/sales-couter-voucher.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-update-order',
    templateUrl: './update-order.component.html',
    styleUrls: ['./update-order.component.css']
})

export class UpdateOrderComponent implements OnInit {
    rowData: any;
    columnDefs: any;
    gridApi: any;
    gridColumnApi: any;
    totalQuantity: number = 0;
    totalPrice: number = 0;
    totalPayment: number = 0;
    voucherChoice: any = {
        voucher: null,
        voucherShip: null
    };
    voucher: any;
    priceVoucher: number = 0;
    user: any = {
        id: null,
        code: null,
        fullname: '',
        phone: '',
        email: '',
    };

    constructor(
        private orderDetailService: OrderDetailService,
        public matRef: MatDialogRef<UpdateOrderComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private orderService: OrderService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        private matDiaLog: MatDialog,
        private utilService: UtilService,
        private voucherShipService: VoucherShipService,
        private customerService: CustomerServiceService,
        private voucherService: SalesCouterVoucherService,
    ) {
        this.rowData = [];

        const storedUserString = localStorage.getItem('users');
        if (storedUserString) {
            const storedUser = JSON.parse(storedUserString);
            this.user = {
                id: storedUser.id,
                code: storedUser.code,
                fullname: storedUser.fullname,
                phone: storedUser.phone,
                email: storedUser.email,
            };
        }

        this.columnDefs = [
            {
                headerName: 'Tên Sản phẩm',
                field: '',
                suppressMovable: true,
                cellRenderer: (params: { data: { productDetailDTO: { productDTO: { imageURL: any; name: any; }; }; }; }) => {
                    return `
                <div>
                  <img width="60px" height="60px" src="${params.data.productDetailDTO.productDTO.imageURL}">
                  <span class="productName" title="${params.data.productDetailDTO.productDTO.name}">${params.data.productDetailDTO.productDTO.name}</span>
                </div>`;
                },
            },
            {
                headerName: 'Phân Loại',
                field: '',
                suppressMovable: true,
                cellRenderer: (params: { data: { productDetailDTO: { colorDTO: { name: any; }; sizeDTO: { sizeNumber: any; }; }; }; }) => {
                    return `
                    <div style="height: 30px"><span style="font-weight: bold">Color:</span> ${params.data.productDetailDTO.colorDTO.name}</div>
                    <div style="height: 30px"><span style="font-weight: bold">Size: </span> ${params.data.productDetailDTO.sizeDTO.sizeNumber}</div>
                    `;
                }
            },
            {
                headerName: 'Số lượng',
                field: 'quantity',
                suppressMovable: true,
                cellRenderer: (params: {
                    node: any; value: any; data: any;
                }) => {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.value = params.value || 1;
                    input.min = '1'; // Đặt giá trị min là 1

                    const maxQuantity = params.data.productDetailDTO.quantity || 0;
                    input.max = maxQuantity.toString(); // Đặt giá trị max là giá trị của productDetailDTO.quantity

                    input.style.width = '30%';

                    input.addEventListener('input', () => {
                        let value = parseInt(input.value);

                        // Kiểm tra giá trị nhập vào có nằm trong khoảng [1, maxQuantity]
                        if (isNaN(value) || value < 1) {
                            value = 1;
                        } else if (value > maxQuantity) {
                            value = maxQuantity;
                        }

                        input.value = value.toString();
                    });

                    input.addEventListener('change', () => {
                        const value = parseInt(input.value);
                        params.node.setDataValue('quantity', value);

                        // Tính lại tổng số lượng và tổng tiền
                        this.totalQuantity = this.rowData.reduce((total, orderDetail) => total + (orderDetail.quantity || 0), 0);
                        this.tinhTong();

                        // Cập nhật lại giá trị "Thành tiền" trong grid với trường totalPriceCurrent
                        const price = params.data.price || 0;
                        params.node.setDataValue('totalPriceCurrent', value * price);

                        // Lấy toàn bộ dữ liệu của dòng hiện tại
                        // const currentRowData = params.data;

                        // orderDetailService.updateOrderDetail(currentRowData).subscribe((res) => {
                        //     if (res.status === 200 || res.message === 'Success'){
                        //         toastr.success('Cập nhật số lượng thành công','Thông báo')
                        //     }
                        // })
                    });

                    return input;
                },
            },
            {
                headerName: 'Giá tiền',
                field: 'price',
                suppressMovable: true,
                valueFormatter: (params: { data: { price: number; }; }) => {
                    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                        .format(params.data.price || 0)
                        .replace('₫', '') + 'đ';
                },
            },
            {
                headerName: 'Thành tiền',
                field: 'totalPriceCurrent', // Sử dụng trường mới để lưu giá trị thành tiền hiện tại
                suppressMovable: true,
                valueFormatter: (params: {
                    data: {
                        quantity: any;
                        price: any; totalPriceCurrent: number;
                    };
                }) => {
                    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                        .format(params.data.totalPriceCurrent || params.data.price * params.data.quantity)
                        .replace('₫', '') + 'đ';
                },
            },
            {
                headerName: 'Thao tác',
                field: '',
                suppressMovable: true,
                cellRenderer: (params: { data: any }) => {
                    const button = document.createElement('button');
                    button.className = 'btn btn-danger';
                    button.innerText = 'Xóa';

                    button.addEventListener('click', () => {
                        this.onDeleteRow(params.data);
                    });

                    return button;
                }
            }
        ];

        this.totalQuantity = this.rowData.reduce((total, orderDetail) => total + (orderDetail.quantity || 0), 0);

        this.tinhTong();
    }

    onDeleteRow(dataCurrent: any) {
        const index = this.rowData.findIndex(item => item.id === dataCurrent.id);

        if (index > -1) {
            // Tính toán số lượng sản phẩm sau khi xóa
            const potentialTotalQuantity = this.totalQuantity - this.rowData[index].quantity;

            // Nếu sau khi xóa, số lượng sản phẩm <= 1, không cho phép xóa
            if (potentialTotalQuantity < 1) {
                this.toastr.error('Nếu số lượng sản phẩm bằng 1 thì không thể xóa. Vui lòng hủy đơn hàng', 'Thông báo');
                return;
            }

            // Xóa sản phẩm và cập nhật lại grid
            this.rowData.splice(index, 1);
            this.gridApi.setRowData(this.rowData);

            // Cập nhật tổng số lượng
            this.totalQuantity = potentialTotalQuantity;
            this.tinhTong();

            this.toastr.success('Xóa sản phẩm thành công', 'Thông báo');
        }

        this.cdr.detectChanges();
    }

    // onDeleteRow(dataCurrent: any) {
    //     if (this.totalQuantity > 1) {
    //         const index = this.rowData.findIndex(item => item.id === dataCurrent.id);
    //         if (index > -1) {
    //             this.rowData.splice(index, 1);

    //             // Cập nhật dữ liệu cho ag-grid
    //             this.gridApi.setRowData(this.rowData);

    //             // Cập nhật tổng số lượng
    //             this.totalQuantity = this.rowData.reduce((total, orderDetail) => total + (orderDetail.quantity || 0), 0);

    //             this.tinhTong();

    //             this.toastr.success('Xóa sản phẩm thành công', 'Thông báo');
    //         }

    //         this.cdr.detectChanges();
    //     } else {
    //         this.toastr.error('Nếu số lượng sản phẩm bằng 1 thì không thể xóa. Vui lòng hủy đơn hàng', 'Thông báo');
    //     }
    // }

    ngOnInit(): void {
        this.orderDetailService.getAllOrderDetailByOrder(this.data.id).subscribe(res => {
            this.rowData = res.orderDetail;

            this.totalQuantity = this.rowData.reduce((total, orderDetail) => total + (orderDetail.quantity || 0), 0);

            this.tinhTong();
        });
    }

    tinhTong() {
        this.totalPrice = this.rowData.reduce((total, orderDetail) =>
            total + (orderDetail.quantity * orderDetail.price || 0), 0);

        // totalPayment có thể bằng totalPrice hoặc có thể bao gồm thêm các yếu tố khác (nếu có)
        this.totalPayment = this.totalPrice;

        this.priceVouchers()
    }

    priceVouchers() {
        if (this.priceVoucher === 0) {
            this.totalPayment = this.totalPrice;
        } else {
            this.totalPayment = this.totalPrice - this.priceVoucher;
        }
    }

    onGridReady(params: any) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    openVoucherSC() {
        const originalTotalMoney = this.totalPrice;
        let selectCustomerCurrent = null;

        if (this.data.idCustomer) {
            // Nếu đã có idCustomer, bạn có thể gọi API để lấy thông tin khách hàng
            this.customerService.findById(this.data.idCustomer).subscribe(res => {
                selectCustomerCurrent = res; // Lưu trữ thông tin khách hàng vào biến
                // Có thể làm gì đó với thông tin khách hàng
            }, (error) => {
                console.error('Error fetching customer info:', error);
            });
        } else {
            console.warn('No customer ID provided.');
        }

        const dialogRef = this.matDiaLog.open(PogupVoucherSCComponent, {
            width: '45%',
            height: '90vh',
            data: {
                total: originalTotalMoney,
                voucherChoice: this.voucherChoice,
                customer: selectCustomerCurrent,
            }
        })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event === 'saveVoucher') {

                if (result.data.voucher !== null) {
                    this.voucherService.getVoucherSales(result.data.voucher).subscribe(res => {
                        this.voucher = res.data;

                        if (res.data.voucherType === 1) {
                            const reducedVoucherPrice = parseFloat(((res.data.reducedValue / 100) * this.totalPrice).toFixed(2));

                            if (reducedVoucherPrice > res.data.maxReduced) {
                                this.totalPayment = this.totalPrice - this.voucher.maxReduced;
                                this.priceVoucher = this.voucher.maxReduced;
                            } else {
                                this.totalPayment = this.totalPrice - reducedVoucherPrice;
                                this.priceVoucher = reducedVoucherPrice;
                            }

                        } else {
                            this.totalPayment = this.totalPrice - this.voucher.reducedValue;
                            this.priceVoucher = res.data.reducedValue;
                        }

                        this.voucherChoice.voucher = res.data.code;
                        this.cdr.detectChanges();
                    });
                }
            }
        });
    }

    clearVoucher() {
        this.priceVoucher = 0;
        this.totalPayment = this.totalPrice;
        this.voucherChoice.voucher = null;
        this.tinhTong();
        this.toastr.success('Xóa Voucher thành công', 'Thông báo');
    }

    capNhat() {
        Swal.fire({
            title: 'Bạn muốn cập nhật không',
            text: 'Thao tác này sẽ không hoàn tác',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Thoát',
        }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
                const orderCurrent = this.data;

                if (this.voucherChoice.voucher === null) {
                    orderCurrent.codeVoucher = null;
                } else {
                    orderCurrent.codeVoucher = this.voucherChoice.voucher;
                }

                orderCurrent.totalPrice = this.totalPrice;
                orderCurrent.totalPayment = this.totalPayment;
                orderCurrent.idStaff = this.user.id;

                this.orderService.updateOrder(orderCurrent).subscribe(
                    (res) => {
                        if (res.status === 200 || res.message === 'Success') {
                            this.orderDetailService.deleteOrderDetailByIdOrder(orderCurrent.id).subscribe((res) => {
                                if (res.status === 200 || res.message === 'Success') {
                                    for (let product of this.rowData) {
                                        const orderDetail = {
                                            idOrder: product.idOrder, // Sử dụng idOrder từ product
                                            idProductDetail: product.idProductDetail,
                                            quantity: product.quantity,
                                            price: product.price,
                                        };

                                        this.orderDetailService.createDetailSales(orderDetail).subscribe(res => {
                                            if (res.status !== 'OK') {
                                                return;
                                            } else {
                                                this.matRef.close('updateOrder');
                                            }
                                        });
                                    }
                                }
                            })
                        } else {
                            this.toastr.error('Đã xảy ra lỗi vui lòng thực hiện lại sau', 'Thông báo')
                        }

                    },
                    (error) => {
                        console.error('Material add error', error);
                    }
                );
                Swal.fire('Cập nhật', 'Cập nhật thành công', 'success');
            }
        });
    }
}

