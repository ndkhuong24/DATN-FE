import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/service/product.service';
import { ProductdetailService } from 'src/app/service/productdetail.service';

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


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private productDetailService: ProductdetailService,
        private productService: ProductService
    ) {
        this.columnDefs = [
            {
                headerName: 'Màu sắc',
                field: 'colorDTO.code',
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
}