# Medusa v2 Architecture Q&A — Bộ Câu Hỏi Phản Biện Chuyên Sâu

> **Tài liệu tổng hợp các câu hỏi kiến trúc cốt lõi thường gặp khi làm việc với Medusa v2 (Customer Module, Auth Module, Database Constraints, Transactions & Saga Pattern).**  
> *Dành cho việc tự ôn luyện, thảo luận kỹ thuật và phản biện với đồng nghiệp / Tech Lead.*

---

## MỤC LỤC

1. [Q1: Tại sao mỗi khách hàng chỉ được có TỐI ĐA 1 Default Shipping và 1 Default Billing?](#q1-tại-sao-mỗi-khách-hàng-chỉ-được-có-tối-đa-1-default-shipping-và-1-default-billing)
2. [Q2: Partial Unique Index là gì? Tại sao Medusa v2 lại sử dụng nó trên bảng `customer_address`?](#q2-partial-unique-index-là-gì-tại-sao-medusa-v2-lại-sử-dụng-nó-trên-bảng-customer_address)
3. [Q3: Tại sao trước bảo "Medusa không dùng Transaction", nhưng chỗ này lại bảo "bọc trong Transaction"?](#q3-tại-sao-trước-bảo-medusa-không-dùng-transaction-nhưng-chỗ-này-lại-bảo-bọc-trong-transaction)
4. [Q4: Tại sao trong bảng `auth_identity`, `customer_id` chỉ được lưu trong `app_metadata` (JSONB) mà không tạo cột riêng hay Foreign Key?](#q4-tại-sao-trong-bảng-auth_identity-customer_id-chỉ-được-lưu-trong-app_metadata-jsonb-mà-không-tạo-cột-riêng-hay-foreign-key)
5. [Q5: Tóm tắt kịch bản 45 giây giải thích cho đồng nghiệp / Tech Lead](#q5-tóm-tắt-kịch-bản-45-giây-giải-thích-cho-đồng-nghiệp--tech-lead)
6. [Q6: Tại sao tài liệu Customer Module không liệt kê TẤT CẢ các bảng có chứa `customer_id` (như `cart`, `order`, `auth_identity`...)?](#q6-tại-sao-tài-liệu-customer-module-không-liệt-kê-tất-cả-các-bảng-có-chứa-customer_id-như-cart-order-auth_identity)
7. [Q7: Tại sao việc xác định rõ Bounded Context là nhiệm vụ sống còn để làm chủ Customer Module?](#q7-tại-sao-việc-xác-định-rõ-bounded-context-là-nhiệm-vụ-sống-còn-để-làm-chủ-customer-module)
8. [Q8: Bảng `customer` và bảng `user` khác nhau như thế nào? Tại sao chúng chả liên quan gì đến nhau?](#q8-bảng-customer-và-bảng-user-khác-nhau-như-thế-nào-tại-sao-chúng-chả-liên-quan-gì-đến-nhau)
9. [Q9: Các điểm cắm (Hook Points) trong Workflow của Customer Module là gì? Cách viết code Custom Logic kèm cơ chế bù trừ Saga (Compensation)?](#q9-các-điểm-cắm-hook-points-trong-workflow-của-customer-module-là-gì-cách-viết-code-custom-logic-kèm-cơ-chế-bù-trừ-saga-compensation)
10. [Q10: Người dùng có thể spam hàng nghìn địa chỉ (`customer_address`) làm sập hệ thống không? Cơ chế phòng thủ 3 lớp trong Enterprise?](#q10-người-dùng-có-thể-spam-hàng-nghìn-địa-chỉ-customer_address-làm-sập-hệ-thống-không-cơ-chế-phòng-thủ-3-lớp-trong-enterprise)

---

### Q1: Tại sao mỗi khách hàng chỉ được có TỐI ĐA 1 Default Shipping và 1 Default Billing?

#### 1. Bản chất của từ "Default" (Mặc định) trong UX & Hệ thống
- **"Mặc định"** là giá trị được hệ thống tự động chọn sẵn khi người dùng chưa đưa ra lựa chọn cụ thể.
- Nếu một khách hàng có 5 địa chỉ trong sổ địa chỉ, nhưng lại có **2 địa chỉ cùng mang cờ `is_default_shipping = true`**:
  - Khi người dùng bấm nút **"Mua ngay" (1-Click Checkout)** hoặc dùng Apple Pay / Google Pay, hệ thống sẽ giao hàng đến đâu? Nhà riêng hay Công ty?
  - Hệ thống rơi vào trạng thái **mơ hồ (Ambiguity)**. Nếu code tự chọn ngẫu nhiên 1 trong 2, đơn hàng sẽ bị giao nhầm địa chỉ mà khách hàng không hề hay biết $\rightarrow$ Khiếu nại, hủy đơn, tốn chi phí hoàn hàng.

#### 2. Tự động hóa tính toán trước giỏ hàng (Cart Estimation)
Khi khách đăng nhập vào Storefront:
- Hệ thống cần **tính trước chi phí vận chuyển** (Shipping Rate) và **thuế** (VAT / Sales Tax theo khu vực) ngay tại trang giỏ hàng trước khi khách bấm sang trang Thanh toán.
- Backend tự động lấy `default_shipping_address` để truyền vào Tax Provider và Fulfillment Provider.
- Điền sẵn vào form Checkout để khách hàng không phải gõ lại 5-6 ô thông tin $\rightarrow$ Tối ưu trải nghiệm mua sắm và tỷ lệ chuyển đổi (Conversion Rate).
$\rightarrow$ **Bắt buộc chỉ được có duy nhất 1 địa chỉ đại diện.**

#### 3. Tại sao lại tách riêng Default Shipping và Default Billing?
Trong thương mại điện tử, hai mục đích này thường xuyên khác nhau:
- **Default Shipping (Giao hàng):** Nơi shipper mang kiện hàng vật lý tới (Nhà riêng, văn phòng, nhà người thân).
- **Default Billing (Thanh toán / Hóa đơn):** 
  - Địa chỉ đăng ký trên thẻ tín dụng ngân hàng (để vượt qua bước kiểm tra gian lận thẻ **AVS - Address Verification Service** của Visa/Mastercard).
  - Hoặc địa chỉ trụ sở công ty dùng để **xuất hóa đơn đỏ (VAT Invoice)**.
- Do đó, Medusa tách làm 2 cờ độc lập. Nhưng cho mỗi mục đích, **chỉ có tối đa 1 lựa chọn mặc định**.

#### 4. Tại sao là "TỐI ĐA 1" chứ không phải "BẮT BUỘC 1"?
- Khách mới tạo tài khoản, chưa có địa chỉ nào $\rightarrow$ Có **0** địa chỉ mặc định (Hợp lệ).
- Khách có 3 địa chỉ nhưng chủ động bỏ chọn hết cờ mặc định (muốn mỗi lần mua đều tự tay chọn) $\rightarrow$ Có **0** địa chỉ mặc định (Hợp lệ).
- Tuyệt đối **không được phép có $\ge 2$ địa chỉ cùng là mặc định**.

---

### Q2: Partial Unique Index là gì? Tại sao Medusa v2 lại sử dụng nó trên bảng `customer_address`?

#### 1. Khái niệm cốt lõi
- **Unique Index thông thường:** Quét qua **toàn bộ các dòng** trong bảng. Mọi dòng dữ liệu đều bắt buộc phải có giá trị khác nhau.
- **Partial Unique Index (Chỉ mục duy nhất có điều kiện):** Là chỉ mục **chỉ áp dụng tính duy nhất (UNIQUE) trên một tập con (subset) của bảng**, được xác định thông qua mệnh đề **`WHERE`**.
- Những dòng dữ liệu **không thỏa mãn** điều kiện `WHERE` sẽ hoàn toàn bị Index bỏ qua (không cần phải duy nhất và không tốn bộ nhớ trong cây B-Tree của Index).

#### 2. Ví dụ trực quan: Bảng `customer_address` trong Medusa v2

Khách hàng `cus_123` có 3 địa chỉ:
- Địa chỉ A: Nhà riêng $\rightarrow$ `is_default_shipping = false`
- Địa chỉ B: Quê quán $\rightarrow$ `is_default_shipping = false`
- Địa chỉ C: Công ty $\rightarrow$ `is_default_shipping = true`

##### ❌ Nếu dùng Unique Index thông thường:
```sql
CREATE UNIQUE INDEX idx_fail ON customer_address (customer_id, is_default_shipping);
```
- Dòng A (`cus_123`, `false`) $\rightarrow$ OK.
- Dòng B (`cus_123`, `false`) $\rightarrow$ **LỖI DUPLICATE KEY NGAY LẬP TỨC!**
- Vì DB thấy đã có cặp (`cus_123`, `false`) rồi. Nghĩa là khách hàng **không thể lưu nhiều hơn 1 địa chỉ phụ**. Điều này sai hoàn toàn về nghiệp vụ!

##### ✅ Giải pháp chuẩn mực: Partial Unique Index (Có mệnh đề `WHERE`)
Medusa v2 tạo index trong PostgreSQL như sau:
```sql
CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_shipping" 
ON customer_address (customer_id) 
WHERE (is_default_shipping = true);

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_billing" 
ON customer_address (customer_id) 
WHERE (is_default_billing = true);
```

**Cách Database vận hành:**
- Khi thêm Địa chỉ A và B (`is_default_shipping = false`): Không thỏa mãn `WHERE` $\rightarrow$ Database bỏ qua, lưu 100 địa chỉ `false` cũng được.
- Khi thêm Địa chỉ C (`is_default_shipping = true`): Thỏa mãn `WHERE` $\rightarrow$ DB đưa `cus_123` vào Index.
- Nếu cố tình thêm Địa chỉ D cũng có `is_default_shipping = true`: DB tra vào Index thấy `cus_123` đã tồn tại $\rightarrow$ **Chặn đứng ngay lập tức với lỗi `unique_violation`!**

#### 3. Hai lợi ích vượt trội:
1. **Chặn đứng Race Condition ở tầng DB:** Nếu người dùng gửi 2 request cập nhật địa chỉ mặc định song song cùng 1 lúc, dù code ứng dụng có bị lọt (race condition) thì DB vẫn là chốt chặn cuối cùng bảo vệ toàn vẹn dữ liệu.
2. **Siêu tiết kiệm RAM & Disk:** Index chỉ lưu những bản ghi có giá trị `true` (thường chiếm $< 5\%$ tổng số dòng) $\rightarrow$ Cây Index siêu nhẹ, tốc độ ghi và đọc cực nhanh.

---

### Q3: Tại sao trước bảo "Medusa không dùng Transaction", nhưng chỗ này lại bảo "bọc trong Transaction"?

Đây là sự khác biệt kinh điển giữa **Giao dịch phân tán (Distributed Transaction)** và **Giao dịch cục bộ (Local Transaction)**:

| Tiêu chí | Macro: Distributed Transaction (Toàn bộ Workflow) | Micro: Local Database Transaction (Nội bộ 1 Module) |
| :--- | :--- | :--- |
| **Phạm vi** | Xuyên suốt nhiều Module độc lập (Cart + Customer + Order + Payment). | Chỉ nằm trong **1 Module duy nhất** tương tác với **1 Database PostgreSQL**. |
| **Medusa xử lý thế nào?** | **KHÔNG dùng DB Transaction!** Medusa sử dụng **Saga Pattern** với các bước bù trừ (Compensation Steps). | **CÓ DÙNG DB Transaction thông thường (`BEGIN ... COMMIT / ROLLBACK`)!** |
| **Tương đương bên Java/Spring** | Giống như microservices gọi qua REST/Kafka, không thể dùng `@Transactional` chung. | Giống hệt một method có `@Transactional` thao tác trên `EntityManager` / `JpaRepository`. |

#### 1. Cấp độ Vĩ mô (Tại sao Workflow KHÔNG dùng DB Transaction?):
- Quy trình Checkout tạo Order đi qua 4 module: Cart $\rightarrow$ Customer $\rightarrow$ Payment $\rightarrow$ Order.
- Nếu mở 1 SQL Transaction từ đầu đến cuối:
  - Giữ kết nối DB quá lâu (trong lúc chờ cổng thanh toán VNPAY/Stripe phản hồi) $\rightarrow$ Cạn kiệt Connection Pool, sập DB.
  - Vi phạm tính độc lập: Nếu sau này tách module ra thành các Microservice riêng, Two-Phase Commit (2PC) rất cồng kềnh và dễ gây treo hệ thống.
  - $\rightarrow$ **Giải pháp: Dùng Saga Pattern (Step nào lỗi thì chạy Step bồi hoàn để hoàn tác).**

#### 2. Cấp độ Vi mô (Tại sao nội bộ Step CẦN Transaction?):
- Trong Customer Module, thao tác đổi địa chỉ mặc định gồm 2 câu SQL liên tiếp:
  1. `UPDATE customer_address SET is_default_shipping = false WHERE customer_id = 'cus_123'`
  2. `INSERT INTO customer_address (...) VALUES ('cus_123', true)`
- Cả 2 câu này nằm trong cùng 1 Database! Nếu câu 1 thành công mà câu 2 bị lỗi crash mạng:
  - Khách hàng bị mất luôn địa chỉ mặc định cũ mà không có địa chỉ mới nào thay thế.
- $\rightarrow$ **Giải pháp: Phải bọc trong 1 Local Transaction của MikroORM:**
```typescript
await this.manager_.transaction(async (transactionManager) => {
  // 1. Gỡ default cũ
  await transactionManager.nativeUpdate(CustomerAddress, 
    { customer_id: customerId, is_default_shipping: true }, 
    { is_default_shipping: false }
  )
  // 2. Tạo địa chỉ mới làm default
  await transactionManager.persistAndFlush(newAddress)
})
```

---

### Q4: Tại sao trong bảng `auth_identity`, `customer_id` chỉ được lưu trong `app_metadata` (JSONB) mà không tạo cột riêng hay Foreign Key?

Bảng `auth_identity` trong database thực tế của Medusa v2:
```text
Cột: id | app_metadata (jsonb) | created_at | updated_at | deleted_at
```
Dữ liệu thực tế:
```json
{
  "id": "authid_01M1ZK8VMR0PRY7TCVF6PCX416",
  "app_metadata": {
    "user_id": "user_01M1ZK8VHX8T9KSQW5378TC5SV",
    "customer_id": "cus_01M20CMM1TGV172ZD66TDC0W6N"
  }
}
```

Có 4 lý do kiến trúc cốt lõi:

#### 1. Nguyên lý Bounded Context trong Domain-Driven Design (DDD)
- **Auth Module** và **Customer Module** là 2 Bounded Context hoàn toàn độc lập:
  - **Auth Module:** Chỉ lo Xác thực (Authentication - lưu mật khẩu băm, Google OAuth, cấp JWT token). Nó hoàn toàn "mù" về thương mại điện tử, không biết và không quan tâm người đăng nhập mua gì, tên gì.
  - Nếu tạo cột `customer_id` có Foreign Key trỏ sang bảng `customer` $\rightarrow$ Auth Module bị **phụ thuộc cứng (Tight Coupling / Domain Contamination)** vào Customer Module, không thể tái sử dụng độc lập được.

#### 2. Vấn đề Đa chủ thể (Polymorphic Actors)
Trong một nền tảng thương mại điện tử, ai là người cần đăng nhập?
- 🛒 **Customer** (Khách mua hàng).
- 👔 **User** (Admin / nhân viên quản trị Dashboard).
- 🏪 **Vendor / Seller** (Người bán hàng trên sàn Marketplace).
- 🚚 **Driver** (Tài xế giao hàng).
- 🏢 **B2B Member** (Khách hàng doanh nghiệp).

Nếu tạo cột cứng:
- Bảng `auth_identity` sẽ phải chứa: `customer_id`, `user_id`, `vendor_id`, `driver_id`...
- Trở thành "bãi rác" chứa đầy các cột Nullable. Mỗi lần cài thêm 1 plugin người dùng mới, lại phải sửa schema bảng Auth!
- **Giải pháp:** Lưu vào `app_metadata` (JSONB). Auth Identity chỉ đại diện cho một danh tính xác thực thuần túy.

#### 3. Một tài khoản có thể đóng NHIỀU VAI TRÒ (Dual Role)
Một người hoàn toàn có thể vừa là **Admin** quản trị kho hàng ban ngày (`user_id`), vừa dùng chính tài khoản đó làm **Khách hàng** mua hàng thử nghiệm (`customer_id`).
Lưu trong JSONB cho phép 1 Auth Identity đại diện cho nhiều Actor cùng một lúc mà không phá vỡ quan hệ dữ liệu.

#### 4. Sẵn sàng cho Microservices (Database per Service)
Nếu sau này hệ thống scale lớn và tách Auth Module ra một Database riêng (hoặc thay bằng Keycloak/Auth0):
- Foreign Key **không thể trỏ xuyên database**.
- Dùng `app_metadata` (JSONB) giúp hệ thống phân tán dễ dàng mà không cần đập đi xây lại cấu trúc bảng.

---

### Q5: Tóm tắt kịch bản 45 giây giải thích cho đồng nghiệp / Tech Lead

> *"Để hiểu tại sao `customer_id` chỉ nằm trong `app_metadata` của `auth_identity`, đội mình nên nhìn dưới góc độ **Domain-Driven Design (DDD)** của Medusa v2:*
>
> 1. *Thứ nhất, **Tách biệt Bounded Context:** Module Auth chỉ lo đúng một việc là Xác thực (Authentication - băm password, OAuth, cấp JWT token). Nó hoàn toàn độc lập và không phụ thuộc vào bất kỳ module nghiệp vụ nào.*
> 2. *Thứ hai, **Bài toán Đa chủ thể (Polymorphic Actors):** Hệ thống không chỉ có Customer đăng nhập, mà còn có Admin User, Vendor, Driver. Dùng `app_metadata` (JSONB) giúp bảng Auth không bị biến thành bãi rác chứa các cột Foreign Key Nullable (`user_id`, `vendor_id`...).*
> 3. *Thứ ba, **Sẵn sàng cho Microservices:** Việc tách rời này giúp Auth Module có thể chạy trên một Database độc lập trong tương lai mà không bị ràng buộc bởi Foreign Key.*
> 
> *Việc liên kết giữa Auth Identity và Customer hoàn toàn do **Medusa Workflow** ở tầng trên điều phối, đảm bảo kiến trúc Loose Coupling (kết nối lỏng) và Clean Architecture."*

---

### Q6: Tại sao tài liệu Customer Module không liệt kê TẤT CẢ các bảng có chứa `customer_id` (như `cart`, `order`, `auth_identity`...)?

#### 1. Nguyên lý "Module Ownership" & Bounded Context (DDD)
- Tài liệu này là tài liệu chuyên khảo về **Customer Module** (`@medusajs/customer`).
- Trong kiến trúc **Modular Architecture** của Medusa v2: Mỗi Module là một **Bounded Context độc lập**, nó chỉ sở hữu (own) và chịu trách nhiệm về các bảng dữ liệu nội bộ do nó sinh ra:
  - `Customer Module` sở hữu 4 bảng nội bộ: `customer`, `customer_address`, `customer_group`, `customer_group_customer`.
  - Bảng thứ 5 là `customer_account_holder`: là bảng Stored Link do Link Engine sinh ra để nối Customer Module ↔ Auth Module.
- Các bảng khác có liên quan:
  - `cart`, `cart_address` $\rightarrow$ Thuộc quyền sở hữu của **Cart Module** (`@medusajs/cart`).
  - `order`, `order_address` $\rightarrow$ Thuộc quyền sở hữu của **Order Module** (`@medusajs/order`).
  - `auth_identity` $\rightarrow$ Thuộc quyền sở hữu của **Auth Module** (`@medusajs/auth`).
- **Rủi ro nếu liệt kê lẫn lộn:** Nếu đưa `cart` hay `order` vào schema của Customer Module, lập trình viên sẽ bị nhầm lẫn rằng Customer Module quản lý luôn cả Giỏ hàng và Đơn hàng, vi phạm nghiêm trọng nguyên lý **Separation of Concerns (Phân định trách nhiệm)**.

#### 2. Dữ liệu thực tế từ PostgreSQL: Cột `customer_id` & Khóa ngoại (Foreign Key)
Kết quả truy vấn trực tiếp từ PostgreSQL:
1. **`auth_identity` HOÀN TOÀN KHÔNG CÓ cột `customer_id`!** 
   - Auth Module chỉ lưu metadata trong `app_metadata: jsonb`. Sự liên kết giữa Customer và Auth được lưu ở bảng Stored Link `customer_account_holder`.
2. **`order` và `cart` có cột `customer_id`, nhưng KHÔNG CÓ FOREIGN KEY trỏ sang `customer`!**
   - Trong toàn bộ database, **CHỈ CÓ DUY NHẤT 2 BẢNG NỘI BỘ** có Foreign Key cứng tới bảng `customer`:
     - `customer_address.customer_id` $\rightarrow$ `customer(id)`
     - `customer_group_customer.customer_id` $\rightarrow$ `customer(id)`
   - Cột `order.customer_id` và `cart.customer_id` chỉ là **Soft Reference (Tham chiếu mềm)** kiểu `text`, hoàn toàn không có ràng buộc `REFERENCES customer(id)`.
   - **Tại sao?** Để các module `Order` hay `Cart` có thể dễ dàng tách thành Microservices độc lập hoặc chạy trên database riêng biệt (Database per Service) mà không bị gãy ràng buộc khóa ngoại!

#### 3. Các bảng này nằm ở đâu trong tài liệu Notion?
Các bảng liên module không bị bỏ quên, mà được đặt đúng vị trí kiến trúc của chúng tại **Chương 4: Kiến Trúc Tích Hợp Liên Module**:
- **Mục 4.1 (Bảng Module Links):** Giải thích chi tiết liên kết giữa Customer với Cart, Order, Auth, Payment.
- **Mục 4.2 & 4.4 (Sequence Diagrams):** Mô tả dòng chảy dữ liệu thực tế giữa Storefront và các Module.

---

### Q7: Tại sao việc xác định rõ Bounded Context là nhiệm vụ sống còn để làm chủ Customer Module?

#### 1. Chống lại căn bệnh "Spaghetti Architecture" (Ô nhiễm Domain)
Trong thực tế dự án, khách hàng và ban giám đốc sẽ liên tục yêu cầu các tính năng mở rộng:
- *"Lưu điểm thưởng tích lũy của khách hàng."*
- *"Gửi mã OTP Zalo khi khách đăng ký."*
- *"Hiển thị tổng số tiền khách đã chi tiêu (Total Spend)."*

- ❌ **Nếu KHÔNG nắm vững Bounded Context:**
  Dev sẽ tiện tay thêm các cột `loyalty_points`, `otp_code`, `total_spent` vào bảng `customer`, rồi viết logic trừ điểm, gửi tin nhắn, tính toán đơn hàng thẳng vào trong `CustomerService`.
  $\rightarrow$ **Hậu quả:** Sau 6 tháng, bảng `customer` biến thành một **"God Table" khổng lồ**, code đan xen chằng chịt, việc sửa một hàm khách hàng có thể làm sập luôn luồng thanh toán hoặc tính khuyến mãi!
- ✅ **Khi ĐÃ LÀM CHỦ Bounded Context của Customer Module:**
  Bạn sẽ vạch rõ ngay ranh giới:
  - Customer Module chỉ làm đúng vai trò **Sổ Danh Bạ:** Hồ sơ cá nhân + Sổ địa chỉ + Phân nhóm.
  - **Điểm thưởng tích lũy?** $\rightarrow$ Thuộc về **Loyalty Module** (Tạo module riêng và nối qua Module Link).
  - **Mã OTP?** $\rightarrow$ Thuộc về **Auth & Notification Module** (Xác thực xong mới gọi sang Customer để cập nhật).
  - **Tổng chi tiêu?** $\rightarrow$ Thuộc về **Order Module** (Query tính toán từ Order, không lưu cứng vào Customer).

#### 2. Quy tắc ranh giới vàng: "Nội bộ chặt chẽ — Bên ngoài kết nối lỏng"

| Tiêu chí | Bên trong Bounded Context (Nội bộ Customer Module) | Bước qua Bounded Context (Giao tiếp với Module khác) |
| :--- | :--- | :--- |
| **Tính nhất quán dữ liệu** | Nhất quán tuyệt đối, tức thời (**Strong Consistency**). | Nhất quán sau (**Eventual Consistency** qua Saga / Workflows). |
| **Ràng buộc Database** | Có **Foreign Key cứng** (`customer_address` $\rightarrow$ `customer`). | **TUYỆT ĐỐI KHÔNG có Foreign Key cứng** (Dùng Soft Reference như `cart.customer_id` hoặc Stored Link Table). |
| **Cơ chế Transaction** | Dùng **Local Database Transaction** thông thường (`BEGIN ... COMMIT`). | Dùng **Saga Pattern (Compensation Steps)**, không dùng DB Transaction toàn cục. |

---

### Q8: Bảng `customer` và bảng `user` khác nhau như thế nào? Tại sao chúng chả liên quan gì đến nhau?

#### 1. Bảng so sánh đối đầu: `customer` vs `user`

| Tiêu chí | `customer` (Khách Mua Hàng) | `user` (Nhân Viên / Quản Trị Viên) |
| :--- | :--- | :--- |
| **Bản chất nghiệp vụ** | Là **Khách hàng / Người mua sắm** (Shopper / Buyer) bên ngoài Storefront. | Là **Nhân viên / Admin / Operator** nội bộ doanh nghiệp. |
| **Bounded Context & Module** | Thuộc **Customer Module** (`@medusajs/customer`). | Thuộc **User Module** (`@medusajs/user`). |
| **Giao diện tương tác** | Website bán lẻ Storefront, Mobile App mua sắm của khách. | Giao diện quản trị nội bộ: **Medusa Admin Dashboard** (`/app`). |
| **API Endpoints** | Gọi vào các route `/store/*` (`/store/customers`, `/store/carts`...). | Gọi vào các route `/admin/*` (`/admin/products`, `/admin/orders`...). |
| **Dữ liệu đi kèm trong DB** | Sổ địa chỉ (`customer_address`), Nhóm giảm giá (`customer_group`), Công ty B2B (`company_name`). | Cài đặt cá nhân dashboard (`user_preference`), Phân quyền (`user_rbac_role`), Lời mời tuyển dụng (`invite`). |
| **Quy mô dữ liệu (Scale)** | Rất lớn: Hàng trăm nghìn đến **hàng chục triệu bản ghi** (High Throughput). | Rất nhỏ: Chỉ vài người, vài chục đến **vài trăm nhân viên**. |
| **Ràng buộc Database** | **Hoàn toàn KHÔNG CÓ Foreign Key nào** nối giữa 2 bảng này trong PostgreSQL. |

#### 2. Tại sao Medusa tách riêng mà không gộp chung vào 1 bảng `users` với cột `role`?

Trong kiến trúc phần mềm cũ, gộp chung thành 1 bảng `users` với cột `role = 'ADMIN' | 'CUSTOMER'` là một **Anti-Pattern** nghiêm trọng vì:
1. **Tránh ô nhiễm Schema (Schema Pollution):** Khách hàng cần `shipping_address`, `loyalty_points`, `company_name`; nhân viên cần `department`, `salary`, `rbac_role`. Gộp chung sẽ tạo ra một bảng đầy các cột `NULL` chéo nhau.
2. **Ngăn chặn leo thang đặc quyền (Privilege Escalation):** Nếu chung bảng, một lỗi logic nhỏ ở API cập nhật thông tin khách hàng (ví dụ: client inject `{ "role": "ADMIN" }`) có thể biến khách hàng thành Admin hệ thống.
3. **Scale độc lập:** Bảng `customer` có hàng triệu bản ghi đọc/ghi liên tục có thể đánh partition/shard riêng mà không ảnh hưởng tới bảng `user` của khối vận hành.

#### 3. Điểm gặp nhau DUY NHẤT: Cả hai đều là Actor của Auth Module
Cả hai đều là con người cần đăng nhập, vì vậy cùng sử dụng chung **Auth Module** (`auth_identity`):
- Admin đăng nhập `/app` $\rightarrow$ Nhận JWT token mang `actor_id = user_id`, quyền `admin`.
- Khách hàng đăng nhập `/store` $\rightarrow$ Nhận JWT token mang `actor_id = customer_id`, quyền `store`.
- Một người thật ngoài đời hoàn toàn có thể vừa là Admin ban ngày (`user_id`), vừa mua hàng ban đêm (`customer_id`) trên cùng một danh tính Auth mà không bị xung đột dữ liệu.

---

### Q9: Các điểm cắm (Hook Points) trong Workflow của Customer Module là gì? Cách viết code Custom Logic kèm cơ chế bù trừ Saga (Compensation)?

#### 1. Danh mục 6 Workflow Hook Points chính thức trong Medusa Core

Trong mã nguồn Medusa Core (`packages/core/core-flows/src/customer`), có 6 điểm cắm hook sẵn sàng:

| Workflow | Tên Hook Point (`createHook`) | Dữ liệu nhận được | Nghiệp vụ thực tế hay dùng |
| :--- | :--- | :--- | :--- |
| **`createCustomersWorkflow`** | `customersCreated` | `{ customers: CustomerDTO[], additional_data }` | Tạo ví điểm thưởng trong `LoyaltyModule`, khởi tạo hạn mức công nợ B2B, tạo hồ sơ trên CRM (HubSpot/Salesforce). |
| **`updateCustomersWorkflow`** | `customersUpdated` | `{ customers: CustomerDTO[], additional_data }` | Đồng bộ thông tin đổi tên/SĐT sang hệ thống ERP nội bộ. |
| **`deleteCustomersWorkflow`** | `customersDeleted` | `{ ids: string[] }` | Đóng băng tài khoản liên kết, khóa ví điện tử. |
| **`createCustomerAddressesWorkflow`** | `addressesCreated` | `{ addresses: CustomerAddressDTO[], additional_data }` | Gọi Google Maps API chuẩn hóa địa chỉ, tính tọa độ GPS (lat/lng) phục vụ giao hàng. |
| **`updateCustomerAddressesWorkflow`** | `addressesUpdated` | `{ addresses: CustomerAddressDTO[], additional_data }` | Cập nhật lại tọa độ giao hàng mới. |
| **`deleteCustomerAddressesWorkflow`** | `addressesDeleted` | `{ ids: string[] }` | Dọn dẹp cache địa chỉ giao hàng. |

#### 2. Mã nguồn mẫu chuẩn Enterprise: Loyalty Wallet Hook có Saga Compensation

Tạo file `src/workflows/hooks/customer-created.ts`:

```typescript
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"

// 🎯 Chọc hook vào điểm customersCreated của createCustomersWorkflow
createCustomersWorkflow.hooks.customersCreated(
  // 1. EXECUTION STEP: Chạy đồng bộ trong luồng Saga
  async ({ customers, additional_data }, { container }) => {
    const loyaltyModuleService = container.resolve("loyaltyModuleService")
    const createdWallets = []

    // Lưu ý: customers là MẢNG (Array), cần duyệt for để an toàn cho cả Batch Import
    for (const customer of customers) {
      const wallet = await loyaltyModuleService.createWallet({
        customer_id: customer.id,
        initial_points: 100, // Tặng 100 điểm tân thủ
        referral_code: additional_data?.referral_code, // Nhận dữ liệu truyền thêm từ API
      })
      createdWallets.push(wallet)
    }

    // Trả về kết quả kèm dữ liệu Rollback (tham số thứ 2)
    return new StepResponse(createdWallets, { 
      createdWalletIds: createdWallets.map((w) => w.id) 
    })
  },

  // 2. COMPENSATION STEP: Tự động chạy khi có lỗi ở các bước sau để Hoàn tác dữ liệu
  async (compensationData, { container }) => {
    if (!compensationData?.createdWalletIds?.length) return

    const loyaltyModuleService = container.resolve("loyaltyModuleService")
    // Xóa sạch các ví vừa tạo để không để lại dữ liệu rác mồ côi
    await loyaltyModuleService.deleteWallets(compensationData.createdWalletIds)
  }
)
```

#### 3. Hai Edge Cases sống còn khi viết Workflow Hook:
1. **Cạm bẫy "Hành động bất khả hoàn tác" (Irreversible Actions):**  
   Tuyệt đối KHÔNG gọi gửi SMS, Zalo ZNS, Email trong Workflow Hook! Vì nếu step sau bị lỗi, hàm Compensation không thể "thu hồi" tin nhắn đã gửi đến máy khách hàng.
   - Hành động có thể hoàn tác (Tạo ví điểm, ghi DB) $\rightarrow$ Đưa vào **Workflow Hook**.
   - Hành động không thể hoàn tác (Gửi Email/Zalo) $\rightarrow$ Đưa vào **Event Subscriber** (`customer.created`).
2. **Dữ liệu `customers` là mảng:** Phải luôn dùng vòng lặp `for...of`, không được giả định mảng chỉ có 1 phần tử `customers[0]` để tránh lỗi khi Admin chạy Batch Import.

---

### Q10: Người dùng có thể spam hàng nghìn địa chỉ (`customer_address`) làm sập hệ thống không? Cơ chế phòng thủ 3 lớp trong Enterprise?

#### 1. Thực tế trong Medusa v2: Lỗ hổng Resource Exhaustion (DoS)
- Mặc định, Medusa Core **không đặt con số trần** cho số lượng địa chỉ của một khách hàng (vì các khách hàng doanh nghiệp B2B có thể có hàng trăm chi nhánh/kho hàng).
- **Hậu quả nếu bị bot spam 10.000 địa chỉ:**
  1. **Treo cứng Admin UI:** Trong file `customer-address-section.tsx`, component dùng `addresses.map(...)` để render toàn bộ danh sách mà **không có phân trang hay virtual scroll**. 10.000 phần tử DOM sẽ làm trình duyệt Admin bị đóng băng (Browser Crash).
  2. **Node.js Out of Memory (OOM):** Khi query `GET /store/customers/me?fields=*addresses`, Node.js phải nạp toàn bộ 10.000 object vào bộ nhớ để serialize JSON, dễ dẫn đến tràn RAM và crash server.

#### 2. Mô hình phòng thủ 3 lớp (Defense in Depth)

```
[ Hacker / Bot ]
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Lớp 1: API Gateway / Cloudflare (Rate Limiting)        │ -> Tối đa 5 request / phút / IP
└────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Lớp 2: Medusa Middleware (Business Quota Soft Guard)   │ -> Chặn nếu addresses.length >= 20
└────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Lớp 3: PostgreSQL Trigger (Hard Guard chống Race Cond)  │ -> DB ném lỗi nếu count >= 20
└────────────────────────────────────────────────────────┘
```

#### 3. Mã nguồn Quota Middleware (src/api/middlewares.ts):
```typescript
import { defineMiddlewares } from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/customers/me/addresses",
      method: "POST",
      middlewares: [
        async (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
          const customerId = req.auth_context.actor_id

          // Đếm số lượng địa chỉ hiện tại của khách hàng
          const [, count] = await customerModuleService.listAndCountCustomerAddresses({
            customer_id: customerId,
          })

          const MAX_ADDRESSES = 20 // Giới hạn nghiệp vụ

          if (count >= MAX_ADDRESSES) {
            return res.status(400).json({
              message: `Bạn chỉ được phép lưu tối đa ${MAX_ADDRESSES} địa chỉ trong sổ địa chỉ.`,
            })
          }

          next()
        },
      ],
    },
  ],
})
```

*Lưu ý nâng cao:* Middleware là chốt chặn mềm hiệu quả cho 99.9% trường hợp. Với các đợt tấn công đồng thời cực cao (Concurrent Requests qua mặt bộ đếm), Lớp 3 (PostgreSQL Trigger) sẽ là chốt chặn cứng bảo vệ toàn vẹn tuyệt đối cho Database.


