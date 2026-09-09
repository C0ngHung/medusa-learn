# Kế hoạch Học tập & Thực hành: Làm chủ Medusa Customer Module (v2)

> **Mục tiêu Trọng tâm:** Nghiên cứu thật rõ **Customer Module** trong MedusaJS v2. Hiểu cấu trúc mặc định, mức độ ảnh hưởng (impact) khi tích hợp với các module khác, và cách mở rộng/xử lý dữ liệu (đặc biệt là xử lý trùng lặp `has_account`) khi nhận các task tích hợp như Social Login.
>
> **Cập nhật lần cuối:** 2026-09-08
> **Trạng thái:** Đang thực thi

---

## Tổng quan Phases

| Phase | Nội dung | Trọng tâm | Trạng thái |
|---|---|---|---|
| 1 | Cài đặt & Hiểu kiến trúc tổng quan | Set up base project | ✅ Đã hoàn thành |
| 2 | Deep Dive Customer Module Mặc định | Data models, `has_account`, CRUD | ⬜ Chưa bắt đầu |
| 3 | Tương tác & Impact với các Module khác | Cart, Order, Promotion, Auth | ⬜ Chưa bắt đầu |
| 4 | Mở rộng Customer Module (Extend) | Custom fields (Avatar, Social ID) | ⬜ Chưa bắt đầu |
| 5 | Xử lý Data Integrity (Merge Logic) | Xử lý trùng lặp email Guest vs Registered | ⬜ Chưa bắt đầu |
| 6 | Thực chiến: Social Login Use Case | Gọi Workflow update Customer từ Provider | ⬜ Chưa bắt đầu |

---

## 1. Customer Module Mặc Định Có Sẵn Những Gì?
Customer Module bản chất là một cái "kho" lưu trữ danh bạ khách hàng. Nó cực kỳ "thuần khiết" và chỉ tập trung vào 3 việc:

1. **Lưu thông tin cá nhân (Customer):** `first_name`, `last_name`, `email`, `phone`, `metadata`.
2. **Lưu Địa chỉ (Customer Address):** Một khách hàng có thể lưu nhiều địa chỉ giao hàng (Shipping) và thanh toán (Billing) mặc định.
3. **Phân nhóm (Customer Group):** Gom khách hàng thành các nhóm (VD: VIP, Wholesale) để phục vụ cho các module khác.
4. **Điểm chốt hạ lớn nhất (Cờ `has_account`):**
   - Khách mua vãng lai (Guest) -> `has_account = false`.
   - Khách có tài khoản -> `has_account = true`.

> ⚠️ **Điều nó KHÔNG làm:** Nó hoàn toàn KHÔNG chứa password, KHÔNG chứa token, KHÔNG quan tâm user đăng nhập bằng Google hay Facebook.

---

## 2. Khi Integrate với module khác, Impact (Ảnh hưởng) là gì?
Vì Customer Module được thiết kế hoàn toàn độc lập (Isolated), nó đóng vai trò là "Trung tâm dữ liệu" để các Module khác bám vào:

- **Với Promotion/Pricing Module:** Các module này query bảng `CustomerGroup` để biết user này có được giảm giá hay áp bảng giá riêng hay không.
- **Với Cart/Order Module:** Khi user checkout, Cart Module link một chiều tới ID của Customer. Toàn bộ lịch sử mua hàng nằm bên Order Module, chỉ link ngược về Customer.
- **Với Auth Module (Khi làm Social Login):** Hệ thống gọi workflow `createCustomersWorkflow` để insert một dòng họ tên/email vào bảng `customer`, set `has_account = true`. Sau đó Auth Module tự lo phần kết nối (linking).

---

## 3. Khi nhận Task Social Login, cần làm gì với Customer Module?
Chỉ cần trả lời 2 câu hỏi cốt lõi:

1. **Dữ liệu trả về (Avatar, Ngày sinh...) có nhét vừa vào bảng Customer mặc định không?**
   - *Nếu vừa (Chỉ lấy Name, Email):* Dùng Customer Module mặc định.
   - *Nếu không vừa:* Phải **Extend Customer Module** (thêm custom fields vào model Customer) hoặc dùng trường `metadata`.
2. **Xử lý trùng lặp (Impact lớn nhất):** 
   - Nếu data từ Social đổ về mang email ĐÃ TỒN TẠI dưới dạng Guest (`has_account = false`).
   - Logic: Phải update dòng Guest đó thành `has_account = true` thông qua Workflow, tuyệt đối không tạo thêm dòng mới gây rác data và mất lịch sử đơn hàng.

---

## Chi tiết Kế hoạch Thực thi (Action Plan)

### Phase 2: Làm chủ Customer Module Mặc định
**Mục tiêu:** Nắm vững cấu trúc DB và API mặc định của Customer.
1. Khảo sát DB thực tế (`customer`, `customer_address`, `customer_group`).
2. Thực hành tạo Customer bằng Medusa Admin.
3. Dùng Postman gọi Store API tạo Guest Checkout (sinh ra `has_account = false`).
4. Dùng Postman gọi Store API tạo User Registration (sinh ra `has_account = true`).

### Phase 3: Phân tích Tương tác (Module Links)
**Mục tiêu:** Hiểu cách dữ liệu được link mà không cần Foreign Key.
1. Query thử Cart và xem cách nó lưu `customer_id`.
2. Tạo thử một Order cho Guest, sau đó xem lịch sử order.
3. Nhìn nhận cách Auth Module lưu `app_metadata.customer_id` để map với Customer.

### Phase 4: Mở rộng Customer Module (Extend)
**Mục tiêu:** Lưu thêm các dữ liệu không có sẵn (VD: Avatar URL từ Google, Zalo ID).
1. Quyết định cách lưu trữ: Dùng `metadata` hay tạo bảng mở rộng bằng cách Extend Model.
2. Code thử module extension để thêm trường `avatar_url` vào bảng Customer.
3. Update API để Storefront có thể get được trường này.

### Phase 5: Xử lý Data Integrity (Trùng lặp Guest/Registered)
**Mục tiêu:** Xử lý case khó nhất khi Integrate.
1. Tái hiện lỗi: Tạo Guest bằng email A. Sau đó tạo Registered bằng email A. (Xem Medusa xử lý mặc định ra sao).
2. Viết Custom Workflow: Nhận input là email từ Social.
   - Check DB xem có tồn tại Guest không.
   - Nếu có: Update `has_account = true`.
   - Nếu không: Create new customer.
3. Expose Workflow này thành API nội bộ để Auth Provider gọi.

### Phase 6: Áp dụng vào thực tế (Tích hợp Provider)
**Mục tiêu:** Mang toàn bộ kiến thức trên vào task "Tích hợp Đăng nhập Mạng Xã Hội".
1. Cấu hình 1 Auth Provider (Google hoặc Custom).
2. Ở bước Callback của Auth Provider, gọi Workflow đã viết ở Phase 5 để xử lý thông tin khách hàng.
3. Link `auth_identity_id` với `customer_id` bằng `setAuthAppMetadataStep`.
4. Test toàn bộ luồng từ Storefront.
