import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/product.service';
import {CookieService} from 'ngx-cookie-service';
import {UsersDTO} from '../model/UsersDTO';
import {OrderService} from '../../service/order.service';
import {OrderDetailService} from '../../service/order-detail.service';
import {Order} from '../model/Order';
import {OrderDetail} from '../model/OrderDetail';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {SizeService} from '../../service/size.service';
import {MausacService} from '../../service/mausac.service';
import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from '../login/login.component';
import {CustomerComponent} from '../customer/customer.component';
import {CustomerServiceService} from '../../service/customer-service.service';
import {CustomerSalesDTO} from '../model/CustomerSalesDTO';
import {OrderSalesCounterComponent} from '../order-sales-counter/order-sales-counter.component';
import * as printJS from 'print-js';
import {ToastrService} from 'ngx-toastr';
import {ProductdetailService} from '../../service/productdetail.service';
import {GiaoHangServiceService} from '../../service/giao-hang-service.service';
import Swal from 'sweetalert2';
import {PaymentSalesService} from '../../service/payment-sales.service';
import {UtilService} from '../../util/util.service';
import {CommonFunction} from '../../util/common-function';
import {ValidateInput} from '../model/validate-input';
import {PogupVoucherSCComponent} from './pogup-voucher-sc/pogup-voucher-sc.component';
import {SalesCouterVoucherService} from '../../service/sales-couter-voucher.service';

@Component({
  selector: 'app-sales-counter',
  templateUrl: './sales-counter.component.html',
  styleUrls: ['./sales-counter.component.scss'],
})

export class SalesCounterComponent implements OnInit {
  public isProductListVisible: boolean = true;
  public isCustomerNull: boolean = true;
  isChecked: boolean = false;
  count = 0;
  searchTerm: string = '';
  showResults: boolean = false;
  listOder: any[] = [];
  searchResults: any[] = [];
  searcherCustomer: string = '';
  showCustomer: boolean = false;
  searchCustomerResults: any[] = [];
  listProductPush: any[];
  totalAllProducts: number = 0;
  priceCustomer: number = 0;
  priceVoucher: number = 0;
  userDTO: string;
  fullname: string;
  idStaff: string;
  currentOrderId = 1;
  listSizePR: any[];
  listColor: any[];
  listSizeFind: any[];
  lisColorFind: any[];
  name: string;
  animal: string;
  selectedOption: string = '1';
  selectedCustomer: any;
  idCustomer = null;
  user: UsersDTO = {};
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;
  hasPermission: boolean;
  product: any;
  qrResultString: string;
  colorId: number | null = null;
  sizeId: number | null = null;
  torchEnabled = false;
  tryHarder = false;
  isdn: string;
  checkStatus: number = 0;
  listCart = [];
  observable: any = [];
  listProductDetail: any = [];
  listProvince = [];
  listDistrict = [];
  listWard = [];
  addressNotLogin: any = {
    provinceId: undefined,
    districtId: undefined,
    wardCode: undefined,
    specificAddress: undefined
  };
  shipFee = 0;
  shipFeeReduce = null;
  totalMoneyPay;
  reducePriceProduct = 0;
  typeOrder: number | null = null;
  statusOrder: number | null = null;
  receiver: string;
  receiver_phone: string;
  receiver_mail: string;

  voucherChoice: any = {
    voucher: null,
    voucherShip: null
  };
  statusPayment: any;
  voucher: any;
  voucherShip: any;
  codeVoucher: any;
  validReceiver: ValidateInput = new ValidateInput();
  validEmail: ValidateInput = new ValidateInput();
  validReceiverPhone: ValidateInput = new ValidateInput();
  validProvince: ValidateInput = new ValidateInput();
  validDistrict: ValidateInput = new ValidateInput();
  validWard: ValidateInput = new ValidateInput();
  specificAddress: ValidateInput = new ValidateInput();

  constructor(private productService: ProductService, private cookieService: CookieService,
              private orderService: OrderService, private orderDetailService: OrderDetailService,
              private router: Router, private sizeService: SizeService, private colorService: MausacService,
              private dialog: MatDialog, private customerService: CustomerServiceService, private toastr: ToastrService, private cdr: ChangeDetectorRef,
              private productDetailService: ProductdetailService, private giaoHangService: GiaoHangServiceService, private paymentService: PaymentSalesService,
              public utilService: UtilService, private voucherService: SalesCouterVoucherService, private route: ActivatedRoute
  ) {
    this.statusPayment = this.route.snapshot.queryParamMap.get('vnp_TransactionStatus');
  }

  search() {
    this.isProductListVisible = true;
    if (this.searchTerm.trim() === '') {
      console.log('mời nhập tên hoặc mã sản phẩm');
    } else {
      this.productService.searchProduct(this.searchTerm).subscribe(
        data => {
          this.searchResults = data;
        }
      );
    }
    this.showResults = this.searchTerm.length > 0;
  }

  searchCustomer() {
    this.idCustomer = null;
    this.isCustomerNull = true;
    if (this.searcherCustomer.trim() === '') {
      console.log('Mời nhập sdt khách hàng');
      this.isCustomerNull = false;
      this.idCustomer = null;
    } else {
      this.customerService.findCustomerByPhone(this.searcherCustomer).subscribe(
        customer => {
          this.searchCustomerResults = customer;
        }
      );
      this.showCustomer = this.searcherCustomer.length > 0;
    }
  }

  addOrder() {
    if (this.count > 4) {
      this.toastr.error('Hóa đơn đã được tạo tối đa');
      return;
    }
    this.count++;
    let order = {
      id: this.count,
      name: 'Hóa Đơn ' + this.count,
      productList: []
    };
    this.listOder.push(order);
    localStorage.setItem('coutOrder', this.count.toString());
    localStorage.setItem('listOrder', JSON.stringify(this.listOder));
    console.log(order);
  }

  removeOrder(order: any) {
    const index = this.listOder.indexOf(order);
    console.log(order);
    if (this.count > 1) {
      if (index !== -1) {
        this.listOder.splice(index, 1);
        this.count--;
        console.log(this.count);
      }
    }
    localStorage.setItem('coutOrder', this.count.toString());
    localStorage.setItem('listOrder', JSON.stringify(this.listOder));
    localStorage.removeItem(`orderProducts_${this.currentOrderId}`);
  }

  addProductInOrder(row: any) {
    if (!row.quantity) {
      row.quantity = 1;
    }
    if (row.reducePrice != null && row.percentageReduce != null) {
      this.reducePriceProduct = row.price - row.reducePrice;
    } else {
      this.reducePriceProduct = row.price;
    }
    this.listProductPush.push(row);
    this.listCart.push(
      {
        productId: row.id,
        productDetailId: null,
        sizeId: null,
        size_number: null,
        colorId: null,
        nameColor: null,
        quantity: 1,
        price: this.reducePriceProduct,
        quantityInstock: null
      }
    );
    // this.listProductPush.push(row);
    this.cookieService.set('listProductPush', JSON.stringify(this.listProductPush));
    const currentOrderProducts = this.listProductPush.map(product => ({...product}));
    localStorage.setItem(`orderProducts_${this.currentOrderId}`, JSON.stringify(currentOrderProducts));
    this.isProductListVisible = false;
    this.calculateTotalAllProducts();
    this.clearSearchTerm();
    this.priceVouchers();
    this.loadData();
  }

  addCustomer(row: any) {
    if (!row.quantity) {
      row.quantity = 1;
    }
    this.searcherCustomer = `${row.fullname} - ${row.phone}`;
    this.selectedCustomer = row;
    this.isCustomerNull = false;
    this.idCustomer = this.selectedCustomer.id;
    console.log(this.selectedCustomer);
  }

  clearSearchTerm(): void {
    this.searchTerm = '';
  }

  getProductListForCurrentOrder() {
    const currentOrder = this.listOder.find(order => order.id === this.currentOrderId);
    if (currentOrder) {
      this.listProductPush = currentOrder.productList;
      // this.calculateTotalPrice();
      this.calculateTotalAllProducts();
    }
  }

  removeProduct(index: number): void {
    Swal.fire({
      title: 'Bạn có xác nhận xóa sản phẩm ?',
      text: '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý'
    }).then(result => {
      if (result.isConfirmed) {
        this.listCart.splice(index, 1);
        this.listCart = [...this.listCart];

        console.log('Xóa: ', this.listCart);
        this.listProductPush.splice(index, 1);
        this.cdr.detectChanges();
        this.calculateTotalAllProducts();
      }
    });
  }

  // calculateTotalPrice() {
  //   this.totalPrice = this.listProductPush.reduce((total, product) => {
  //     const productTotal = product.price * product.quantity;
  //     product.total = productTotal;
  //     return total + productTotal;
  //   }, 0);
  //   this.calculateTotalAllProducts();
  //   this.priceVouchers();
  // }

  calculateTotalAllProducts() {
    this.totalAllProducts = 0;
    for (let i = 0; i < this.listCart.length; i++) {
      if (this.listCart[i].quantity <= 0) {
        this.toastr.error('số lượng sản phẩm phải lớn hơn 0');
        return;
      }
      const totalPrice = this.listCart[i].quantity * this.listCart[i].price;
      this.totalAllProducts += totalPrice;
    }
    this.priceVouchers();
  }

  priceVouchers() {
    if (this.priceVoucher === 0) {
      this.priceCustomer = this.totalAllProducts;
    } else {
      this.priceCustomer = this.totalAllProducts - this.priceVoucher;
    }

  }

  onSizeChange(event: any, i): void {
    console.log(event);
    console.log(i);

    if (event === undefined) {
      this.listColor = [...this.lisColorFind];
    } else {
      this.listColor = [...this.lisColorFind];
      const selectedSizeId = event.id;
      const number_size = event.sizeNumber;
      const detailsForSelectedSize = this.listProductPush[i].productDetailDTOList
        .filter(detail => detail.idSize === selectedSizeId && detail.idColor);
      const colorIDsForSelectedSize = detailsForSelectedSize.map(detail => detail.idColor);
      this.listColor = this.listColor.filter(color => colorIDsForSelectedSize.includes(color.id));
      this.listCart[i] = {
        ...this.listCart[i],
        sizeId: selectedSizeId,
        size_number: number_size
      };
      this.getProductDetail(i);
      console.log(this.listCart);
    }
  }

  getProductDetail(index: any) {
    if (this.listCart[index].sizeId !== null && this.listCart[index].colorId !== null) {
      this.listProductPush[index].productDetailDTOList.filter(d => d.idSize === this.listCart[index].sizeId && d.idColor === this.listCart[index].colorId).map(pd => {
        console.log(pd.id);
        if (pd.quantity <= 0) {
          this.toastr.error('sản phẩm đã hết hàng');
        }
        return this.listCart[index] = {
          ...this.listCart[index],
          productDetailId: pd.id,
          quantityInstock: pd.quantity
        };
      });
    } else {
      return;
    }
  }

  onColorChange(event: any, i: any): void {

    if (event === undefined) {
      this.listSizePR = [...this.listSizeFind];
    } else {
      this.listSizePR = [...this.listSizeFind];
      const selectedColorId = event.id;
      const colorName = event.name;
      const detailsForSelectedColor = this.listProductPush[i].productDetailDTOList
        .filter(detail => detail.idColor === selectedColorId && detail.idSize);

      const sizeIDsForSelectedColor = detailsForSelectedColor.map(detail => detail.idSize);

      this.listSizePR = this.listSizePR.filter(size => sizeIDsForSelectedColor.includes(size.id));
      this.listCart[i] = {
        ...this.listCart[i],
        colorId: selectedColorId,
        nameColor: colorName
      };
      this.getProductDetail(i);
    }
  }

  placeOrderSales() {
    this.receiver = CommonFunction.trimText(this.receiver);
    this.receiver_mail = CommonFunction.trimText(this.receiver_mail);
    this.receiver_phone = CommonFunction.trimText(this.receiver_phone);
    this.validateReceiver();
    this.validateReceiverPhone();
    this.validateEmail();
    this.validateProvince();
    this.validateDistrict();
    this.validateWard();
    if (this.listProductPush.length === 0){
      this.toastr.error('không có sản phẩm nào để thanh toán');
      return;
    }
    if (this.listCart.some(c => c.sizeId === null || c.colorId === null)) {
      this.toastr.error('chưa chọn size và màu sắc của sản phẩm');
      return;
    }
    this.user = JSON.parse(localStorage.getItem('users'));
    this.isdn = this.user.isdn;
    console.log(this.isdn);
    if (this.user === null) {
      this.toastr.error('đã hết hạn đăng nhập');
    }
    if (this.isChecked === true) {
      this.typeOrder = 0;
      this.statusOrder = 1;
      if (!this.validReceiver.done || !this.validEmail.done || !this.validReceiverPhone.done || !this.validProvince.done
        || !this.validDistrict.done || !this.validWard.done) {
        return;
      }
    } else {
      this.typeOrder = 1;
      this.statusOrder = 3;
    }
    for (let i = 0; i < this.listCart.length; i++) {
      const idProductDetail = this.listCart[i].quantityInstock;
      if (this.listCart[i].quantity <= 0) {
        this.toastr.error('Số lượng sản phẩm phải lớn hơn 0');
        return;
      }
      if (idProductDetail <= 0) {
        this.toastr.error('sản phẩm đã hết hàng');
        return;
      }
      if (this.listCart[i].quantity > this.listCart[i].quantityInstock) {
        this.toastr.error('Không đủ số lượng sản phẩm');
        return;
      }
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
        if (this.selectedOption === '1') {
          const order: Order = {
            paymentType: 1,
            totalPrice: this.totalAllProducts,
            totalPayment: this.priceCustomer,
            idCustomer: this.idCustomer,
            idStaff: this.user.id,
            addressReceived: this.isChecked ? (this.addressNotLogin?.specificAddress + ', ' + ward?.WardName + ', '
              + district?.DistrictName + ', ' + province?.ProvinceName) : null,
            statusPayment: 0,
            shipPrice: this.shipFee,
            codeVoucher: this.voucher ? this.voucher?.code : null,
            email: 'customer123@gmail.com',
            type: this.typeOrder,
            status: this.statusOrder,
            receiver: this.receiver,
            receiverPhone: this.receiver_phone
          };
          this.orderService.createOrderSales(order).subscribe(
            (response) => {
              console.log('done', response);
              const saveIdOrder = response.data.id;
              console.log(this.listProductPush);

              for (let i = 0; i < this.listCart.length; i++) {
                const orderDetail: OrderDetail = {
                  idOrder: saveIdOrder,
                  idProductDetail: this.listCart[i].productDetailId,
                  quantity: this.listCart[i].quantity,
                  price: this.listCart[i].price,
                };
                console.log(orderDetail);
                this.orderDetailService.createDetailSales(orderDetail).subscribe(res => {
                  if (res.status === 'OK') {
                    localStorage.removeItem('listProductPush');
                    this.refreshData();
                    this.removeOrder(order);
                    this.calculateTotalAllProducts();
                    localStorage.removeItem(`orderProducts_${this.currentOrderId}`);
                    localStorage.setItem('coutOrder', this.count.toString());
                    localStorage.removeItem('listOrder');
                  } else {
                    this.checkStatus = 1;
                    console.log('Lỗi');
                    return;
                  }
                });
              }
            }
          );
          this.paymentService.createPayment(this.priceCustomer).subscribe(resPay => {
            if (resPay.status === 'OK') {
              // sessionStorage.setItem('order', JSON.stringify(objCheckOut));
              // setTimeout()
              window.location.href = resPay.url;
            }
          });
          //   }
          // });
        } else {
          const order: Order = {
            paymentType: 0,
            totalPrice: this.totalAllProducts,
            totalPayment: this.priceCustomer,
            idCustomer: this.idCustomer,
            shipPrice: this.shipFee,
            idStaff: this.user.id,
            addressReceived: this.isChecked ? (this.addressNotLogin?.specificAddress + ', ' + ward?.WardName + ', '
              + district?.DistrictName + ', ' + province?.ProvinceName) : null,
            statusPayment: 0,
            codeVoucher: this.voucher ? this.voucher?.code : null,
            email: 'customer123@gmail.com',
            type: this.typeOrder,
            status: this.statusOrder,
            receiver: this.receiver,
            receiverPhone: this.receiver_phone
          };
          this.orderService.createOrderSales(order).subscribe(
            (response) => {
              console.log('done', response);
              const saveIdOrder = response.data.id;
              console.log(this.listProductPush);

              for (let i = 0; i < this.listCart.length; i++) {
                const orderDetail: OrderDetail = {
                  idOrder: saveIdOrder,
                  idProductDetail: this.listCart[i].productDetailId,
                  quantity: this.listCart[i].quantity,
                  price: this.listCart[i].price,
                };
                console.log(orderDetail);
                this.orderDetailService.createDetailSales(orderDetail).subscribe(res => {
                  if (res.status === 'OK') {
                    console.log('thanh toán thành công');
                  } else {
                    this.checkStatus = 1;
                    console.log('Lỗi');
                    return;
                  }
                });
              }
              Swal.fire({
                title: 'Thanh toán thành công !',
                text: '',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then(results => {
                if (results.isConfirmed) {
                  this.printInvoice();
                  localStorage.removeItem('listProductPush');
                  this.refreshData();
                  this.removeOrder(order);
                  this.calculateTotalAllProducts();
                  localStorage.removeItem('listOrder');
                  localStorage.removeItem(`orderProducts_${this.currentOrderId}`);
                  // localStorage.setItem('coutOrder', this.count.toString());
                  // localStorage.setItem('listOrder', JSON.stringify(this.listOder));
                }
              });
            }
          );
        }
      }
    });
  }

  refreshData() {
    this.selectedCustomer = '';
    this.searcherCustomer = '';
    this.idCustomer = null;
    this.priceCustomer = 0;
    this.priceVoucher = 0;
    this.listCart = [];
    this.totalAllProducts = 0;
    this.listProductPush = [];
    this.addressNotLogin.specificAddress = null;
    this.receiver = null;
    this.receiver_phone = null;
    this.receiver_mail = null;
    this.addressNotLogin.wardCode = null;
    this.addressNotLogin.districtId = null;
    this.addressNotLogin.provinceId = null;
    this.shipFee = 0;
  }

  generateOrderHTML(): string {
    let orderHTML = `<div>`;
    orderHTML += `<h2>Hóa đơn</h2>`;
    orderHTML += `<p>Tên nhân viên: ${this.fullname}</p>`;
    orderHTML += `<p>Tên khách hàng: ${this.selectedCustomer ? this.selectedCustomer.fullname : 'Khách lẻ'}</p>`;
    orderHTML += `<p>Số điện thoại: ${this.selectedCustomer ? this.selectedCustomer.phone : ''}</p>`;
    orderHTML += `<h3>Chi tiết đơn hàng</h3>`;
    orderHTML += `<table border="1" cellpadding="10">`;
    orderHTML += `<thead>`;
    orderHTML += `<tr>`;
    orderHTML += `<th>Mã</th>`;
    orderHTML += `<th>Tên</th>`;
    orderHTML += `<th>Size</th>`;
    orderHTML += `<th>Màu Sắc</th>`;
    orderHTML += `<th>Số lượng</th>`;
    orderHTML += `<th>Đơn giá</th>`;
    orderHTML += `<th>Thành tiền</th>`;
    orderHTML += `</tr>`;
    orderHTML += `</thead>`;
    orderHTML += `<tbody>`;
    this.listProductPush.forEach(product => {
      orderHTML += `<tr>`;
      orderHTML += `<td>${product.code}</td>`;
      orderHTML += `<td>${product.name}</td>`;
      this.listCart.forEach(details => {
        if (product.id === details.productId) {
          orderHTML += `<td>${details.size_number}</td>`;
          orderHTML += `<td>${details.nameColor}</td>`;
          orderHTML += `<td>${details.quantity}</td>`;
          orderHTML += `<td>${details.price}</td>`;
          orderHTML += `<td>${details.quantity * details.price}</td>`;
        }
      });
      orderHTML += `</tr>`;
    });
    orderHTML += `</tbody>`;
    orderHTML += `</table>`;
    orderHTML += `<p>Giảm giá: ${this.priceVoucher} đ</p>`;
    orderHTML += `<p>Tổng thanh toán: ${this.priceCustomer} đ</p>`;
    orderHTML += `</div>`;
    return orderHTML;
  }

  printInvoice() {
    const invoiceHTML = this.generateOrderHTML();
    const frame = document.createElement('iframe');
    frame.style.display = 'none';
    document.body.appendChild(frame);
    frame.contentDocument.open();
    frame.contentDocument.write(invoiceHTML);
    frame.contentDocument.close();
    printJS({
      printable: frame.contentDocument.body,
      type: 'html',
      properties: ['name', 'quantity', 'price', 'total'],
      header: '<h3 class="custom-h3">Hóa đơn bán hàng</h3>',
      style: '.custom-h3 { color: red; }',
      documentTitle: 'hoa don',
    });

    document.body.removeChild(frame);
  }

  onTabChange(event: MatTabChangeEvent): void {
    console.log('Tab: ', event);
    const selectedTabIndex = event.index;
    this.currentOrderId = this.listOder[selectedTabIndex].id;
    this.getProductListForCurrentOrder();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: '1200px',
      height: '600px',
      data: {name: this.name}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  openDialogBill(): void {
    const dialogRef = this.dialog.open(OrderSalesCounterComponent, {
      width: '1300px',
      height: '700px',
      data: {name: this.name}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  ngOnInit(): void {
    if (this.statusPayment === '00'){
      this.toastr.success('thanh toán thành công');
    }
    const listOrderCookie = localStorage.getItem('listOrder');
    const countOrderCookie = localStorage.getItem('coutOrder');
    if (countOrderCookie && listOrderCookie) {
      this.count = parseInt(countOrderCookie, 10);
      this.listOder = JSON.parse(listOrderCookie);
    } else {
      this.count = 1;
      this.listOder.push({
        id: 1,
        name: 'Hóa Đơn ' + 1,
        productList: []
      });
      localStorage.setItem('coutOrder', this.count.toString());
      localStorage.setItem('listOrder', JSON.stringify(this.listOder));
    }
    this.getProductListForCurrentOrder();
    const users = JSON.parse(localStorage.getItem('users'));
    this.userDTO = users;
    this.fullname = users.fullname;
    this.idStaff = users.id;
    this.listOder.forEach(order => {
      const orderProductsKey = `orderProducts_${order.id}`;
      const storedOrderProducts = localStorage.getItem(orderProductsKey);
      if (storedOrderProducts) {
        order.productList = JSON.parse(storedOrderProducts);
      }
    });
    this.selectedOption = '0';
    this.loadData();
    this.giaoHangService.getAllProvince().subscribe(res => {
      this.listProvince = res.data;
    });

  }

  loadData() {
    this.sizeService.getAllSize().subscribe(data => {
      this.listSizePR = data;
      this.listSizeFind = data;
    });
    this.colorService.getAllMauSac().subscribe(datams => {
      this.listColor = datams;
      this.lisColorFind = datams;
    });
    this.productDetailService.getAllProductDetail().subscribe(dataDT => {
      this.listProductDetail = dataDT;
      console.log(this.listProductDetail);
    });
  }

  validateNullListProduct(): boolean {
    if (this.listProductPush === null) {
      return false;
    }
    return true;
  }

  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.searchTerm = resultString;
    if (this.searchTerm.trim() === '') {
      console.log('Mời nhập tên hoặc mã sản phẩm');
    } else {
      this.productService.searchProduct(this.searchTerm).subscribe(
        data => {
          this.searchResults = data;
          const existingProduct = this.listProductPush.find(product => product.id === this.searchResults[0].id);

          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            const newProduct = {...this.searchResults[0], quantity: 1};
            this.listProductPush.push(newProduct);
          }
          this.cookieService.set('listProductPush', JSON.stringify(this.listProductPush));
          const currentOrderProducts = this.listProductPush.map(product => ({...product}));
          localStorage.setItem(`orderProducts_${this.currentOrderId}`, JSON.stringify(currentOrderProducts));
          this.isProductListVisible = false;
          // this.calculateTotalPrice();
          this.calculateTotalAllProducts();
          this.clearSearchTerm();
          this.priceVouchers();
        }, error => {
          this.toastr.error('Sản phẩm không tồn tại', 'Lỗi');
        }
      );
    }
  }


  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
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
      this.priceCustomer = this.shipFee + this.priceCustomer;
    });
  }

  selectedOpsiontGH() {
    if (this.isChecked === false) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  //voucher
  openVoucherSC() {
    const originalTotalMoney = this.priceCustomer;
    const dialogRef = this.dialog.open(PogupVoucherSCComponent, {
      width: '45%',
      height: '90vh',
      data: {total: originalTotalMoney, voucherChoice: this.voucherChoice}
    }).afterClosed().subscribe(result => {
      if (result.event === 'saveVoucher') {
        console.log(result.data);
        this.totalMoneyPay = originalTotalMoney;
        if (result.data.voucher !== null) {
          this.voucherService.getVoucherSales(result.data.voucher).subscribe(res => {
            this.voucher = res.data;
            if (res.data.voucherType === 1) {
              const reducedVoucherPrice = parseFloat(((res.data.reducedValue / 100) * this.priceCustomer).toFixed(2));

              console.log(reducedVoucherPrice);
              if (reducedVoucherPrice > res.data.maxReduced) {
                this.priceCustomer = this.priceCustomer - this.voucher.maxReduced;
                this.voucher.reducedValue = this.voucher.maxReduced;
              } else {
                this.priceCustomer = this.priceCustomer - this.voucher.reducedValue;
              }
            } else {
              this.priceCustomer = this.priceCustomer - this.voucher.reducedValue;
            }
            this.priceVoucher = this.voucher.reducedValue;
            this.voucherChoice.voucher = res.data.codess;
            console.log(this.voucher.code);
            this.cdr.detectChanges();
          });
        }
        // if (result.data.voucherShip !== null) {
        //   this.voucherShipService.getVoucherShip(result.data.voucherShip).subscribe(res => {
        //     this.voucherShip = res.data;
        //     if (this.shipFee <= res.data.reducedValue) {
        //       this.shipFeeReduce = this.shipFee;
        //       this.totalMoneyPay = this.totalMoneyPay - this.shipFee;
        //     } else {
        //       this.totalMoneyPay = this.totalMoneyPay - res.data.reducedValue;
        //       this.shipFeeReduce = res.data.reducedValue;
        //     }
        //     this.voucherChoice.voucherShip = res.data.code;
        //     this.cdr.detectChanges();
        //   });
        // }
      }
    });
  }

// validate
  revoveInvalid(result) {
    result.done = true;
  }

  validateReceiver() {
    this.validReceiver = CommonFunction.validateInput(this.receiver, 250, null);
  }

  validateEmail() {
    this.validEmail = CommonFunction.validateInput(this.receiver_mail, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  validateReceiverPhone() {
    this.validReceiverPhone = CommonFunction.validateInput(this.receiver_phone, null, /^(0[2-9]|1[2-9]|2[2-9]|3[2-9]|4[2-9]|5[2-9]|6[2-9]|7[2-9]|8[2-9]|9[2-9])\d{8}$/);
  }

  validateSpecificAddress() {
    this.specificAddress = CommonFunction.validateInput(this.addressNotLogin.specificAddress, null, null);
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
