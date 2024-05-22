create database datn;
use datn;


DROP TABLE IF EXISTS `color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'tên',
  `create_date` datetime NOT NULL COMMENT 'Ngày tạo',  
  PRIMARY KEY (`id`) USING BTREE	
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Màu sác của sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `id_product` int NULL COMMENT 'Id map với bảng product',
  `image_name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL COMMENT 'tên ảnh',
  `create_date` datetime NULL COMMENT 'Ngày tạo',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='ảnh của sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `code` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'Mã',
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'tên',
  `create_date` datetime  NULL COMMENT 'Ngày tạo',
  `update_date` datetime COMMENT 'Ngày sửa',
   `create_name` varchar(100)  NULL COMMENT 'map với isdn bảng staff: xem nhân viên vào tạo sp này',
  `update_name` varchar(100) COMMENT 'map với isdn bảng staff: xem nhân viên vào sửa sp này',
  `id_brand` int  NULL COMMENT 'id map với bảng brand',
  `id_category` int  NULL COMMENT 'id map với bảng category',
  `id_material` int  NULL COMMENT 'id map với bảng material',
   `id_sole` int  NULL COMMENT 'id map với bảng sole',
   `price` decimal(24,2) NULL COMMENT 'giá bán',
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Mô tả',
  `status` int COMMENT 'Trạng thái' default 0,
  `idel` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;



DROP TABLE IF EXISTS `size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `size_number` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'số size',
  `create_date` datetime  NULL COMMENT 'Ngày tạo',
  `status` int COMMENT 'Trạng thái' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Kích thước của sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'tên',
  `create_date` datetime  NULL COMMENT 'Ngày tạo',
  `update_date` datetime COMMENT 'Ngày sửa',
  `status` int COMMENT 'Trạng thái' default 0,
  `idel` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Thương hiệu của sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int  NULL AUTO_INCREMENT COMMENT 'Id',
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'tên',
  `create_date` datetime  NULL COMMENT 'Ngày tạo',
  `update_date` datetime  COMMENT 'Ngày sửa',
  `status` int COMMENT 'Trạng thái' default 0,
  `idel` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='danh mục của sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'tên',
  `create_date` datetime  NULL COMMENT 'Ngày tạo',
  `update_date` datetime COMMENT 'Ngày sửa',
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Mô tả',
  `status` int COMMENT 'Trạng thái' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='chất liệu của sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `sole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sole` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `sole_height` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'chiều cao đế giày',
  `sole_material` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'chất liệu đế giày',
  `create_date` datetime  NULL COMMENT 'Ngày tạo',
  `update_date` datetime  COMMENT 'Ngày sửa',
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Mô tả',
  `status` int COMMENT 'Trạng thái' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='đế giày của sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `product_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_detail` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `id_product` int   NULL COMMENT 'id map với bảng product',
  `id_color` int  NULL COMMENT 'id map với bảng color',
  `id_size` int  NULL COMMENT 'id map với bảng size',
  `quantity` int  NULL COMMENT 'số lượng',
  `create_date` datetime NOT NULL COMMENT 'Ngày tạo',
  `update_date` datetime  COMMENT 'Ngày sửa',
  `shoe_collar` int default 0 NULL COMMENT 'cổ giày : 0- cổ thấp , 1: cổ cao',

  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='sản phẩm chi tiết';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `code` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'Mã',
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'tên',
	`create_date` datetime  NULL COMMENT 'Ngày tạo',
	`create_name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'Người tạo: map với isdn bảng staff xem ai tạo voucher này',	
  `start_date` datetime  NULL COMMENT 'Ngày bắt đầu',
  `end_date` datetime  NULL COMMENT 'Ngày kết thúc',
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Mô tả',
  `status` int COMMENT 'Trạng thái' default 0,
  `idel` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
  `dele` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
   `quantity` int COMMENT 'Số lượng',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='giảm giá của sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `discount_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_detail` (
  `id` int not NULL AUTO_INCREMENT COMMENT 'Id',
  `id_product` int  NULL COMMENT 'id của bảng product',
  `id_discount` int  NULL COMMENT 'id map với bảng promotion',
   `reduced_value` decimal(24,2)  NULL COMMENT 'giá trị giảm',
  `discount_type` int  null COMMENT 'loại giảm giá : 1: % , 0: giá tiền',
  `status` int COMMENT 'Trạng thái' default 0,
  `max_reduced`  decimal(24,2)  NULL COMMENT 'giá trị giảm tối đa',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='giảm giá chi tiết';
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `code` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'Mã',
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'name',
  `id_customer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT 'id của bảng customer',
	`create_date` datetime  NULL COMMENT 'Ngày tạo',
  `start_date` datetime  NULL COMMENT 'Ngày bắt đầu',
  `end_date` datetime  NULL COMMENT 'Ngày kết thúc',
  `conditions`  decimal(24,2)  NULL COMMENT 'điều kiện sử dụng',
	`create_name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'Người tạo: map với isdn bảng staff xem ai tạo voucher này',	
    `voucher_type` int  null COMMENT 'loại giảm : 1: % , 0: giá tiền',
`reduced_value` decimal(24,2)  NULL COMMENT 'giá trị giảm',
`description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Mô tả',
  `status` int COMMENT 'Trạng thái' default 0,
  `idel` int COMMENT 'Trạng thái hiển thị : 1.đã xóa 0.bình thường' default 0,
  `dele` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
  `quantity` int COMMENT 'Số lượng' ,
    `amount_used` int COMMENT 'Số lượng sử dụng' ,
  `apply` int COMMENT '1 là tại quầy 0 là web null là tất cả mợi nơi' ,
  `option_customer` int COMMENT '1 là tùy chọn khách  0 là tất cả khách hàng và idcustomer là null' ,
   `max_reduced`  decimal(24,2)  NULL COMMENT 'giá trị giảm tối đa',
   `limit_customer`  int NULL COMMENT 'Giới hạn số lần sử dụng cho mỗi khách hàng',
   `allow` int COMMENT 'Cho phép dùng chung với KM : 1. còn 0 là không cho phép' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Voucher của hóa đơn';
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `code` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'mã nhân viên',
  `fullname` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'tên nhân viên',
  `birthday` datetime not null COMMENT 'ngày sinh',
  `gender`  varchar(50) not null COMMENT 'giới tính',
  `email` varchar(255) not null unique,
  `phone`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'số điện thoại',
  `create_date` datetime NOT NULL COMMENT 'Ngày tạo',
 `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Ghi chú',
 `username` varchar(250)   NULL unique ,
`password` VARCHAR(255) NOT NULL,
`roles` VARCHAR(100) null,
  -- `status` int COMMENT 'Trạng thái' default 0,
  `idel` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
  -- `isdn` VARCHAR(100) DEFAULT (UNIX_TIMESTAMP(NOW())) COMMENT 'mã gen theo thời gian',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='nhân viên';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `id_customer` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'id map với bảng customer',
  `create_date` datetime  NULL COMMENT 'Ngày tạo',
  `province_id` int  NULL COMMENT 'id tỉnh/thành phố',
  `province`  varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'tỉnh/thành phố',
  `district_id`  int  NULL COMMENT 'Id quận / huyện',
  `district`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'quận / huyện',
  `ward_code`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'Mã phường/ xã',
  `wards`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'phường/ xã',
  `specific_address`  varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'địa chi cụ thể',
  `config` int default 1 comment 'check lần gần nhất mà người dùng chọn địa chỉ này : 1 - là chưa chọn ; 0 là đã chọn',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Địa chỉ';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `code` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'mã khách hàng',
  `fullname` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'tên khách hàng',
  `birthday` datetime DEFAULT NULL COMMENT 'ngày sinh',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'số điện thoại',
  `email` varchar(255) NOT NULL,
  `gender` varchar(50) DEFAULT NULL COMMENT 'giới tính',
  `create_date` datetime DEFAULT NULL COMMENT 'Ngày tạo',
  `update_date` datetime DEFAULT NULL COMMENT 'Ngày sửa',
  `username` varchar(250) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` int DEFAULT '0' COMMENT 'Trạng thái',
  `idel` int DEFAULT '0' COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Khách hàng';

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `code` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'mã đơn hàng',
  `id_customer`int   NULL COMMENT 'id map với bảng customer',
  `id_staff`int   NULL COMMENT 'id map với bảng staff',
  `code_voucher` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'map với column code bảng voucher',
  `code_voucher_ship` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'map với column code bảng voucher_free_ship',
  `create_date` datetime  NULL COMMENT 'Ngày tạo',
  `payment_date` datetime  null COMMENT 'ngày thanh toán',
  `delivery_date` datetime  null COMMENT 'ngày giao hàng',
  `received_date` datetime  null COMMENT 'ngày nhận hàng',
  `address_received` longtext  null COMMENT 'địa chỉ nhận hàng',
  `shipper_phone`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'số điện thoại người giao hàng',
  `receiver_phone`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'số điện thoại người nhận hàng',
  `receiver`  varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'người nhận',
`email` varchar(255) not null COMMENT 'Email người nhận',
   `ship_price`  decimal(24,2)  null COMMENT 'phí giao hàng',
   `total_price`  decimal(24,2)  null COMMENT 'tổng tiền',
   `total_payment`  decimal(24,2)  null COMMENT 'tổng tiền',
   `type` int null comment '1 là trên web , 0 là tại quầy',
   `payment_type` int  null COMMENT 'hình thức thanh toán : 0: thanh toán khi nhận hàng , 1: thanh toán online',
	`description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Ghi chú',
    `missed_order` int COMMENT 'các lần bỏ lỡ đơn hàng : khi bỏ lỡ lần 3 sẽ là tự động sang status là Huy',
	`status` int COMMENT 'Trạng thái' default 0,
	`status_payment` int COMMENT 'Trạng thái thanh toán : 0. đã thanh toán , 1. chưa thanh toán' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Đơn hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `order_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_history` (
 `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
 `id_order` int  NULL COMMENT 'id map với bảng order',
 `id_staff`int   NULL COMMENT 'id map với bảng staff',
 `id_customer`int   NULL COMMENT 'id map với bảng customer',
 `status` int COMMENT 'Trạng thái' default 0,
 `create_date` datetime  NULL COMMENT 'Ngày tạo',
 `note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Ghi chú',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='lịch sử sửa đổi đơn hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `id_order` int  NULL COMMENT 'id map với bảng order',
  `id_product_detail`int   NULL COMMENT 'id map với bảng product_detail',
  `quantity`int   NULL COMMENT 'số lượng',
  `price` decimal(24,2)   NULL COMMENT 'giá',
  `code_discount` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'code map với bảng discount',
   `status` int COMMENT 'Trạng thái : 1. trả hàng' default 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Đơn hàng chi tiết';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `voucher_free_ship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher_free_ship` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `code` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'Mã',
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'name',
    `id_customer`longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'id của bảng customer',
	`create_date` datetime  NULL COMMENT 'Ngày tạo',
  `start_date` datetime  NULL COMMENT 'Ngày bắt đầu',
  `end_date` datetime  NULL COMMENT 'Ngày kết thúc',
  `conditions`  decimal(24,2)  NULL COMMENT 'điều kiện sử dụng',
	`create_name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin  NULL COMMENT 'Người tạo: map với isdn bảng staff xem ai tạo voucher này',	
`reduced_value` decimal(24,2)  NULL COMMENT 'giá trị giảm',
`description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'Mô tả',
  `status` int COMMENT 'Trạng thái' default 0,
    `amount_used` int COMMENT 'Số lượng sử dụng' ,
  `idel` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
  `dele` int COMMENT 'Trạng thái xóa : 1.đã xóa 0.bình thường' default 0,
  `quantity` int COMMENT 'Số lượng' ,
  `option_customer` int COMMENT '1 là tùy chọn khách  0 là tất cả khách hàng và idcustomer là null' ,
   `limit_customer`  int NULL COMMENT 'Giới hạn số lần sử dụng cho mỗi khách hàng',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='Voucher của hóa đơn';
/*!40101 SET character_set_client = @saved_cs_client */;