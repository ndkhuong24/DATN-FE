import { Component, OnInit } from '@angular/core';
import { DiscountService } from 'src/app/service/discount.service';
import { ActivatedRoute } from "@angular/router";
import {UtilService} from "../../../util/util.service";

@Component({
  selector: 'app-detail-discount',
  templateUrl: './detail-discount.component.html',
  styleUrls: ['./detail-discount.component.css']
})
export class DetailDiscountComponent implements OnInit {

  discount: any = {
    discountAdminDTO: {
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      createDate: '',
      createName: localStorage.getItem('fullname'),
    },
    spap: '',
    reducedValue: '',
    discountType: '',
    maxReduced: '',
  };

  constructor(private discountService: DiscountService,
              private router: ActivatedRoute,
              public util: UtilService) {}

  ngOnInit(): void {
    // Lấy thông tin khuyến mãi dựa trên id từ tham số URL
    this.router.params.subscribe((params) => {
      const id = params.id;
      this.discountService
        .getDetailDiscount(id)
        .subscribe((response: any) => {
          const firstDiscount = Array.isArray(response) ? response[0] : response;
          this.discount.name =
            firstDiscount.name;
          this.discount.description =
            firstDiscount.description;
          this.discount.startDate =
            firstDiscount.startDate;
          this.discount.endDate =
            firstDiscount.endDate;
          this.discount.createDate =
            firstDiscount.createDate;
          this.discount.createName =
            firstDiscount.createName;
          this.discount.discountType = firstDiscount.discountType;
          this.discount.reducedValue = firstDiscount.reducedValue;
          this.discount.productDTOList = firstDiscount.productDTOList;
          this.discount.maxReduced = firstDiscount.maxReduced;
          console.log(this.discount);
        });
    });
    // Avoid logging here, as it will execute before the HTTP request completes
  }
}
