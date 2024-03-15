import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GiaoHangService} from '../../service/giao-hang.service';
import {CartService} from '../../service/cart.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {OrderService} from '../../service/order.service';
import {PaymentService} from '../../service/payment.service';
import {MatDialog} from '@angular/material/dialog';
import {AddressCheckoutComponent} from './address-checkout/address-checkout.component';
import {PopupVoucherComponent} from './popup-voucher/popup-voucher.component';
import {AddressService} from '../../service/address.service';
import {VoucherService} from '../../service/voucher.service';
import {UtilService} from '../../util/util.service';
import {ValidateInput} from '../../model/validate-input.model';
import {CommonFunction} from '../../util/common-function';
import {VoucherShipService} from '../../service/voucher-ship.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  listCart = [];
  cartData = new Map();
  totalMoney: any;
  totalSaveMoney: any;
  checkChoicePay = 0;
  shipFee = 0;
  shipFeeReduce = null;
  address: any;

  addressNotLogin: any = {
    provinceId: undefined,
    districtId: undefined,
    wardCode: undefined,
    specificAddress: undefined
  };

  voucherChoice: any = {
    voucher: null,
    voucherShip: null
  };

  totalMoneyPay;
  voucher: any;
  voucherShip: any;
  order: any = {
    receiver: '',
    receiverPhone: '',
    description: ''
  };
  email;

  listProvince = [];
  listDistrict = [];
  listWard = [];
  user: any = {
    id: null,
    code: null,
    fullname: '',
    phone: '',
    email: '',
  };
  validReceiver: ValidateInput = new ValidateInput();
  validEmail: ValidateInput = new ValidateInput();
  validReceiverPhone: ValidateInput = new ValidateInput();
  validProvince: ValidateInput = new ValidateInput();
  validDistrict: ValidateInput = new ValidateInput();
  validWard: ValidateInput = new ValidateInput();

  constructor(private giaoHangService: GiaoHangService, private cartService: CartService,
              private cookieService: CookieService, private route: Router, private orderService: OrderService,
              private paymentService: PaymentService, private matDialog: MatDialog,
              private addressService: AddressService, private voucherService: VoucherService, public utilService: UtilService,
              private voucherShipService: VoucherShipService,
              private cdr: ChangeDetectorRef,
              private toaStr: ToastrService
  ) {
    if (this.cookieService.check('checkout')) {
      const cartData = this.cookieService.get('checkout');
      const entries = JSON.parse(cartData);
      this.cartData = new Map(entries);
    }
    const storedUserString = localStorage.getItem('customer');

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
    // @ts-ignore
    window.scrollTo(top, 0, 0);
  }

  ngOnInit(): void {
    this.totalMoney = 0;
    this.totalSaveMoney = 0;
    this.totalMoneyPay = 0;
    this.listCart = [];
    this.order.receiver = this.user.fullname;
    this.order.receiverPhone = this.user.phone;
    this.cartData.forEach((value, key) => {
      const idKey = key.split('-');
      this.cartService.getCart(idKey[0], idKey[1], idKey[2], value).subscribe(res => {
        this.listCart.push(res.data);
        // tslint:disable-next-line:max-line-length
        this.totalSaveMoney += (res.data.productDTO.reducePrice * res.data.quantity);
        this.totalMoney += (res.data.productDTO.price * res.data.quantity) - (res.data.productDTO.reducePrice * res.data.quantity);
        this.totalMoneyPay = this.totalMoney;
      });
    });
    console.log(this.listCart);
    this.getAddress(this.user.id);
    this.giaoHangService.getAllProvince().subscribe(res => {
      this.listProvince = res.data;
    });
  }

  calculateTotal(price: number, quantity: number): string {
    const total = price * quantity;
    return this.utilService.formatMoney(total);
  }

  getDistrict(event) {
    this.giaoHangService.getAllDistrictByProvince(event.ProvinceID).subscribe(res => {
      this.listDistrict = res.data;
    });
  }

  getWard(event) {
    this.giaoHangService.getAllWardByDistrict(event.DistrictID).subscribe(res => {
      this.listWard = res.data;
    });
  }

  getAddress(id: number) {
    const obj = {
      idCustomer: id
    };
    this.addressService.getAddress(obj).subscribe(res => {
      this.address = res.data;
      const addressInfo = {
        service_type_id: 2,
        from_district_id: 3440,
        to_district_id: parseInt(res.data.districtId, 10),
        to_ward_code: res.data.wardCode,
        height: 20,
        length: 30,
        weight: 200,
        width: 40,
        insurance_value: 0,
      };
      this.giaoHangService.getTinhPhiShip(addressInfo).subscribe(res2 => {
        this.shipFee = res2.data.service_fee;
        this.totalMoneyPay = this.shipFee + this.totalMoneyPay;
      });
    });
  }

  getPhiShip() {
    const addressInfo = {
      service_type_id: 2,
      from_district_id: 3440,
      to_district_id: this.addressNotLogin.districtId,
      to_ward_code: this.addressNotLogin.wardCode,
      height: 20,
      length: 30,
      weight: 200,
      width: 40,
      insurance_value: 0,
    };
    this.giaoHangService.getTinhPhiShip(addressInfo).subscribe(res2 => {
      this.shipFee = res2.data.service_fee;
      this.totalMoneyPay = this.shipFee + this.totalMoneyPay;
    });
  }

  thanhToan() {
    if (this.user.id === null && this.user.code === null) {
      this.order.receiver = CommonFunction.trimText(this.order.receiver);
      this.email = CommonFunction.trimText(this.email);
      this.order.receiverPhone = CommonFunction.trimText(this.order.receiverPhone);
      this.validateReceiver();
      this.validateReceiverPhone();
      this.validateEmail();
      this.validateProvince();
      this.validateDistrict();
      this.validateWard();
      if (!this.validReceiver.done || !this.validEmail.done || !this.validReceiverPhone.done || !this.validProvince.done
        || !this.validDistrict.done || !this.validWard.done) {
        return;
      }
      Swal.fire({
        title: 'Bạn có xác nhận thanh toán đơn hàng ?',
        text: '',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý'
      }).then((result) => {
        if (result.isConfirmed) {
          let province = this.listProvince.find(c => c.ProvinceID === this.addressNotLogin.provinceId);
          // console.log(province);
          let district = this.listDistrict.find(d => d.DistrictID === this.addressNotLogin.districtId);
          let ward = this.listWard.find(w => w.WardCode === this.addressNotLogin.wardCode);
          if (this.checkChoicePay === 1) {
            const obj = {
              ...this.order,
              totalPrice: this.totalMoney,
              totalPayment: this.totalMoneyPay,
              shipPrice: this.voucherShip ? this.shipFeeReduce : this.shipFee,
              codeVoucher: this.voucher ? this.voucher?.code : null,
              codeVoucherShip: this.voucherShip ? this.voucherShip?.code : null,
              addressReceived: (this.addressNotLogin.specificAddress === null ? '...' : this.addressNotLogin.specificAddress) + ', ' + ward.WardName + ', '
                + district.DistrictName + ', ' + province.ProvinceName,
              paymentType: 1,
              email: this.email
            };
            // this.orderService.createOrderNotLogin(obj).subscribe(res => {
            //   if (res.status === 'OK') {
            const objOrderBill = {
                  order: obj,
                  listCart: this.listCart
                };
            localStorage.setItem('order-bill', JSON.stringify(objOrderBill));
            this.paymentService.createPayment(this.totalMoneyPay).subscribe(resPay => {
                  if (resPay.status === 'OK') {
                    window.location.href = resPay.url;
                  }
                });
            //   }
            // });
          } else {
            const obj = {
              ...this.order,
              totalPrice: this.totalMoney,
              totalPayment: this.totalMoneyPay,
              shipPrice: this.voucherShip ? this.shipFeeReduce : this.shipFee,
              codeVoucher: this.voucher ? this.voucher?.code : null,
              codeVoucherShip: this.voucherShip ? this.voucherShip?.code : null,
              addressReceived: this.addressNotLogin.specificAddress + ', ' + ward.WardName + ', '
                + district.DistrictName + ', ' + province.ProvinceName,
              paymentType: 0,
              email: this.email
            };
            // this.orderService.createOrderNotLogin(obj).subscribe(res => {
            //   if (res.status === 'OK') {
            const objOrderBill = {
                  order: obj,
                  listCart: this.listCart
                };
            localStorage.setItem('order-bill', JSON.stringify(objOrderBill));
            this.route.navigate(['cart/checkout-detail']);
            //   }
            // });
          }
        }
      });
    } else {
      this.order.receiver = CommonFunction.trimText(this.order.receiver);
      this.order.receiverPhone = CommonFunction.trimText(this.order.receiverPhone);
      this.validateReceiver();
      this.validateReceiverPhone();
      if (!this.validReceiver.done || !this.validReceiverPhone.done) {
        return;
      }
      if (this.address == null) {
        this.toaStr.error('Vui lòng điền điền địa chỉ giao hàng');
        return;
      }
      Swal.fire({
        title: 'Bạn có xác nhận thanh toán đơn hàng ?',
        text: '',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.checkChoicePay === 1) {
            const obj = {
              ...this.order,
              customerDTO: {
                code: this.user.code,
              },
              totalPrice: this.totalMoney,
              totalPayment: this.totalMoneyPay,
              shipPrice: this.voucherShip ? this.shipFeeReduce : this.shipFee,
              codeVoucher: this.voucher ? this.voucher?.code : null,
              codeVoucherShip: this.voucherShip ? this.voucherShip?.code : null,
              addressReceived: (this.addressNotLogin.specificAddress === null ? '...' : this.addressNotLogin.specificAddress) + ', ' + this.address.wards + ', '
                + this.address.district + ', ' + this.address.province,
              paymentType: 1,
              email: this.user.email
            };
            const objOrderBill = {
              order: obj,
              listCart: this.listCart
            };
            // console.log('Order: ', objOrderBill);
            localStorage.setItem('order-bill', JSON.stringify(objOrderBill));
            // this.orderService.createOrder(obj).subscribe(res => {
            //   if (res.status === 'OK') {
            //     const objCheckOut = {
            //       order: res.data,
            //       listCart: this.listCart,
            //     };
            this.paymentService.createPayment(this.totalMoneyPay).subscribe(resPay => {
                  if (resPay.status === 'OK') {
                    // sessionStorage.setItem('order', JSON.stringify(objCheckOut));
                    // setTimeout()
                    window.location.href = resPay.url;
                  }
                });
            //   }
            // });
          } else {
            const obj = {
              ...this.order,
              customerDTO: {
                code: this.user.code,
              },
              totalPrice: this.totalMoney,
              totalPayment: this.totalMoneyPay,
              shipPrice: this.voucherShip ? this.shipFeeReduce : this.shipFee,
              codeVoucher: this.voucher ? this.voucher?.code : null,
              codeVoucherShip: this.voucherShip ? this.voucherShip?.code : null,
              addressReceived: this.address.specificAddress + ', ' + this.address.wards + ', '
                + this.address.district + ', ' + this.address.province,
              paymentType: 0,
              email: this.user.email
            };
            // this.orderService.createOrder(obj).subscribe(res => {
            //   if (res.status === 'OK') {
            const objOrderBill = {
              order: obj,
              listCart: this.listCart
            };
            localStorage.setItem('order-bill', JSON.stringify(objOrderBill));
                // sessionStorage.setItem('order', JSON.stringify(objCheckOut));
            this.route.navigate(['cart/checkout-detail']);
              // }
            // });
          }
        }
      });
    }
  }

  openPopupAddress() {
    this.matDialog.open(AddressCheckoutComponent, {
      width: '40%',
      height: '65vh',
      data: this.user.id
    }).afterClosed().subscribe(res => {
      if (res === 'close-address') {
        this.ngOnInit();
        this.cdr.detectChanges();
      }
    });
  }

  openVoucher() {
    const originalTotalMoney = this.totalMoney + this.shipFee;
    // this.totalMoneyPay = this.totalMoney;
    this.matDialog.open(PopupVoucherComponent, {
      width: '45%',
      height: '90vh',
      data: {total: originalTotalMoney, voucherChoice: this.voucherChoice}
    }).afterClosed().subscribe(result => {
      if (result.event === 'saveVoucher') {
        console.log(result.data);
        this.totalMoneyPay = originalTotalMoney;
        if (result.data.voucher !== null) {
          this.voucherService.getVoucher(result.data.voucher).subscribe(res => {
            this.voucher = res.data;
            if (res.data.voucherType === 1) {
              const reducedVoucherPrice = parseFloat(((res.data.reducedValue / 100) * this.totalMoney).toFixed(2));

              console.log(reducedVoucherPrice);
              if (reducedVoucherPrice > res.data.maxReduced) {
                this.totalMoneyPay = this.totalMoneyPay - this.voucher.maxReduced;
                this.voucher.reducedValue = this.voucher.maxReduced;
              } else {
                this.totalMoneyPay = this.totalMoneyPay - this.voucher.reducedValue;
              }
            } else {
              this.totalMoneyPay = this.totalMoneyPay - this.voucher.reducedValue;
            }
            this.voucherChoice.voucher = res.data.code;
            this.cdr.detectChanges();
          });
        }
        if (result.data.voucherShip !== null) {
          this.voucherShipService.getVoucherShip(result.data.voucherShip).subscribe(res => {
            this.voucherShip = res.data;
            if (this.shipFee <= res.data.reducedValue) {
              this.shipFeeReduce = this.shipFee;
              this.totalMoneyPay = this.totalMoneyPay - this.shipFee;
            } else {
              this.totalMoneyPay = this.totalMoneyPay - res.data.reducedValue;
              this.shipFeeReduce = res.data.reducedValue;
            }
            this.voucherChoice.voucherShip = res.data.code;
            this.cdr.detectChanges();
          });
        }
      }
    });
  }

  revoveInvalid(result) {
    result.done = true;
  }

  validateReceiver() {
    this.validReceiver = CommonFunction.validateInput(this.order.receiver, 250, null);
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  validateReceiverPhone() {
    this.validReceiverPhone = CommonFunction.validateInput(this.order.receiverPhone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }

  validateProvince() {
    this.validProvince = CommonFunction.validateInput(this.addressNotLogin.provinceId, null, null);
  }

  validateDistrict() {
    this.validDistrict = CommonFunction.validateInput(this.addressNotLogin.districtId, null, null);
  }

  validateWard() {
    this.validWard = CommonFunction.validateInput(this.addressNotLogin.wardCode, null, null);
  }
}
