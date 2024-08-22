import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/service/product.service';
import { ProductdetailService } from 'src/app/service/productdetail.service';
import * as QRCode from 'qrcode';

@Component({
    selector: 'app-chi-tiet',
    templateUrl: './chi-tiet.component.html',
    styleUrls: ['./chi-tiet.component.css']
})

export class ChiTietComponent implements OnInit {
    x: any;
    rowData: any[] = [];
    idPd: number;
    columnDefs = [];
    headerHeight = 50;
    rowHeight = 40;
    productDetail: any;
    nameQR: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private productDetailService: ProductdetailService,
        private productService: ProductService,
        private toastr: ToastrService,
    ) {
        this.columnDefs = [
            {
                headerName: 'Màu sắc',
                field: 'colorDTO.name',
                sortable: true,
                filter: true,
                flex: 1,
            },
            {
                headerName: 'Kích cỡ',
                field: 'sizeDTO.sizeNumber',
                sortable: true,
                filter: true,
                flex: 1,
            },
            {
                headerName: 'Số lượng',
                field: 'quantity',
                sortable: true,
                filter: true,
                flex: 1,
            },
            {
                headerName: 'Giá cả',
                field: 'price',
                sortable: true,
                filter: true,
                flex: 1,
                valueFormatter: (params) => {
                    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                        .format(params.value)
                        .replace('₫', '') + 'đ';
                },
            },
            {
                headerName: 'Cổ giày',
                field: 'shoeCollar',
                sortable: true,
                filter: true,
                valueGetter: (params: { data: { shoeCollar: number; }; }) => {
                    return params.data.shoeCollar === 0 ? 'Cổ thấp' : 'Cổ cao';
                },
                flex: 1,
            },
        ];

        this.idPd = data.idPd;
    }

    ngOnInit(): void {
        this.getProductDetailByProductId(this.idPd);
        this.getProductByProductId(this.idPd);
    }

    getProductByProductId(idPd: number) {
        this.productService.GetProduct(idPd).subscribe((res) => {
            this.productDetail = res.data;
        })
    }

    getProductDetailByProductId(idPd: number) {
        this.productDetailService.getProductDetailByProductId(idPd).subscribe(
            (res: any) => {
                if (res.status === 'OK') {
                    this.rowData = res.data;
                } else {
                    console.error('Lỗi khi lấy thông tin sản phẩm:', res.message);
                }
            },
            (error) => {
                console.error('Lỗi khi gọi API:', error);
            }
        );
    }

    qrDownload() {
        this.productDetailService.getProductDetailByProductId(this.idPd).subscribe(
            (res: any) => {
                if (res.status === 'OK') {
                    // Lặp qua từng sản phẩm chi tiết trong res.data
                    res.data.forEach((detail: any) => {
                        // Tạo tên QR với thông tin sản phẩm, màu sắc và kích thước
                        this.nameQR = `${detail.productDTO.name} - ${detail.colorDTO.name} - ${detail.sizeDTO.sizeNumber}`;

                        // Sử dụng product detail id làm dữ liệu cho mã QR
                        const qrData = String(detail.id);

                        // Tạo mã QR với kích thước 256x256
                        QRCode.toDataURL(qrData, { width: 256 }, (err: any, url: string) => {
                            if (err) {
                                this.toastr.error('Đã xảy ra lỗi khi tạo QR', err);
                                return;
                            }

                            // Tạo và tải xuống hình ảnh mã QR
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${this.nameQR}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        });
                    });
                } else {
                    // console.error('Lỗi khi lấy thông tin sản phẩm:', res.message);
                    this.toastr.error('Lỗi khi lấy thông tin sản phẩm', 'Thông báo')
                }
            },
            (error) => {
                // console.error('Lỗi khi gọi API:', error);
                this.toastr.error('Lỗi khi lấy thông tin sản phẩm', 'Thông báo')
            }
        );
    }
}