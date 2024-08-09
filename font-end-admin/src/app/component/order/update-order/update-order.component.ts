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
                valueFormatter: (params: { data: { quantity: any; }; }) => {
                    return padZero(params.data.quantity);
                },
            },
            {
                headerName: 'Giá tiền',
                field: 'price',
                suppressMovable: true,
                valueFormatter: (params: { data: { price: number; }; }) => {
                    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                        .format(params.data.price)
                        .replace('₫', '') + 'đ';
                },
            },
            {
                headerName: 'Thành tiền',
                field: '',
                suppressMovable: true,
                valueFormatter: (params: { data: { price: number; quantity: number; }; }) => {
                    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                        .format(params.data.price * params.data.quantity)
                        .replace('₫', '') + 'đ';
                },
            },
            {
                headerName: 'Thao tác',
                field: '',
                suppressMovable: true,
                cellRenderer: (params: { data: any }) => {
                    // Tạo nút HTML
                    const button = document.createElement('button');
                    button.className = 'btn btn-danger';  // Thêm lớp CSS cho nút
                    button.innerText = 'Xóa';  // Văn bản hiển thị trên nút

                    button.addEventListener('click', () => {
                        this.onDeleteRow(params.data);
                    });

                    return button;
                }
            }
        ];
    }

    onDeleteRow(dataCurrent: any) {
        if (this.totalQuantity > 1) {
            this.orderDetailService.deleteOrderDetail(dataCurrent.id).subscribe((res) => {
                if (res.status === 200 || res.message === 'Success') {
                    const index = this.rowData.findIndex(item => item.id === dataCurrent.id);
                    if (index > -1) {
                        this.rowData.splice(index, 1);
                        // Cập nhật dữ liệu cho ag-grid
                        this.gridApi.setRowData(this.rowData);
                        // Cập nhật tổng số lượng
                        this.totalQuantity = this.rowData.reduce((total, orderDetail) => total + (orderDetail.quantity || 0), 0);

                        this.tinhTong();

                        this.toastr.success('Xóa sản phẩm thành công', 'Thông báo');
                    }
                    this.cdr.detectChanges();
                } else {
                    this.toastr.error('Không thể xóa sản phẩm. Vui lòng thử lại.', 'Thông báo');
                }
            }, (error) => {
                this.toastr.error('Đã xảy ra lỗi trong quá trình xóa sản phẩm. Vui lòng thử lại.', 'Thông báo');
            });
        } else {
            this.toastr.error('Nếu số lượng sản phẩm bằng 1 thì không thể xóa. Vui lòng hủy đơn hàng', 'Thông báo');
        }
    }

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
                orderCurrent.idStaff=this.user.id;

                this.orderService.updateOrder(orderCurrent).subscribe(
                    (result) => {
                        this.matRef.close('updateOrder');
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

